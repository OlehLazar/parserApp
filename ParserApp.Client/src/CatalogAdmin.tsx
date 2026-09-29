import { useEffect, useState, type SyntheticEvent } from 'react'
import ProductCard from './components/ProductCard'
import ProductSourceForm from './components/ProductSourceForm'
import type { Product, ProductDraft } from './types'

const PRODUCTS_URL = '/api/products'

async function getProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL)
  if (!response.ok) {
    throw new Error('Could not load products. Please try again.')
  }

  let items: unknown
  try {
    items = await response.json()
  } catch {
    throw new Error('The products API returned an invalid response. Check that the API proxy is configured.')
  }

  if (!Array.isArray(items)) {
    throw new Error('The products API returned an unexpected response.')
  }

  return items as Product[]
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  const message = await response.text()
  return message || fallback
}

function CatalogAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [targetUrl, setTargetUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isParsing, setIsParsing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProductDraft>({ name: '', description: '', imageUrl: '' })
  const [busyProductId, setBusyProductId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isCurrent = true

    getProducts()
      .then((items) => {
        if (isCurrent) setProducts(items)
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load products.')
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  async function refreshProducts() {
    setProducts(await getProducts())
  }

  async function handleParse(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')

    const trimmedUrl = targetUrl.trim()
    try {
      const parsedUrl = new URL(trimmedUrl)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error()
    } catch {
      setError('Enter a valid http or https URL to parse.')
      return
    }

    setIsParsing(true)
    try {
      const response = await fetch(`${PRODUCTS_URL}/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trimmedUrl),
      })
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'The product parse request failed.'))
      }

      await refreshProducts()
      setTargetUrl('')
      setNotice('Products refreshed from the source URL.')
    } catch (parseError: unknown) {
      setError(parseError instanceof Error ? parseError.message : 'The product parse request failed.')
    } finally {
      setIsParsing(false)
    }
  }

  function startEditing(product: Product) {
    setError('')
    setNotice('')
    setEditingId(product.id)
    setDraft({ name: product.name, description: product.description, imageUrl: product.imageUrl })
  }

  async function handleSave(productId: number) {
    setError('')
    setNotice('')
    setBusyProductId(productId)
    try {
      const response = await fetch(`${PRODUCTS_URL}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, ...draft }),
      })
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Could not save this product.'))
      }

      await refreshProducts()
      setEditingId(null)
      setNotice('Product changes saved.')
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this product.')
    } finally {
      setBusyProductId(null)
    }
  }

  async function handleDelete(productId: number) {
    setError('')
    setNotice('')
    setBusyProductId(productId)
    try {
      const response = await fetch(`${PRODUCTS_URL}/${productId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Could not delete this product.'))
      }

      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
      setNotice('Product deleted.')
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this product.')
    } finally {
      setBusyProductId(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] text-[#20231f]">
      <header className="border-b border-[#dedfd7] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-lg bg-[#e9f3eb] text-[#2f6845]">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
                <path d="m4.5 7.7 7.5 4.4 7.5-4.4M12 12v8.5" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718074]">Store workspace</p>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Catalog Admin Panel</h1>
            </div>
          </div>
          <span className="hidden items-center gap-2 text-sm text-[#657067] sm:flex">
            <span className="size-2 rounded-full bg-[#4c9a67]" />
            Product catalog
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <ProductSourceForm
          productCount={products.length}
          targetUrl={targetUrl}
          isParsing={isParsing}
          error={error}
          notice={notice}
          onTargetUrlChange={setTargetUrl}
          onSubmit={handleParse}
        />

        <section aria-labelledby="products-heading" className="pt-7">
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 id="products-heading" className="text-lg font-semibold">Products</h2>
            {!isLoading && <p className="text-sm text-[#788078]">Manage your catalog items</p>}
          </div>

          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#6f776f]" role="status">
              <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-[#cbd4cb] border-t-[#2f6845]" />
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div className="border-y border-dashed border-[#cbd0c7] py-16 text-center">
              <p className="font-medium text-[#343a34]">Your catalog is empty</p>
              <p className="mt-1 text-sm text-[#7d847d]">Parse a product page to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {products.map((product) => {
                const isEditing = editingId === product.id
                const isBusy = busyProductId === product.id

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    draft={draft}
                    isEditing={isEditing}
                    isBusy={isBusy}
                    isAnyProductBusy={busyProductId !== null}
                    onDraftChange={(field, value) => setDraft((currentDraft) => ({ ...currentDraft, [field]: value }))}
                    onStartEditing={() => startEditing(product)}
                    onCancelEditing={() => setEditingId(null)}
                    onSave={() => void handleSave(product.id)}
                    onDelete={() => void handleDelete(product.id)}
                  />
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default CatalogAdmin