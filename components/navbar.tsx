"use client"

import { useState, useEffect } from "react"
import { Search, X, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, Product } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const navLinks = [
  { label: "Inicio", href: "#" },
  { label: "Productos", href: "#productos" },
  { label: "Contacto", href: "#contacto" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [products, setProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()

  // Fetch products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }
    fetchProducts()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchValue.trim() === '') {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.category_label.toLowerCase().includes(searchValue.toLowerCase())
    )
    
    setSearchResults(filtered.slice(0, 5)) // Limit to 5 results
    setShowSearchResults(true)
  }, [searchValue, products])

  const handleProductClick = (product: any) => {
    // Navegar directamente a la página del producto
    router.push(`/product/${product.id}`)
    // Limpiar búsqueda
    setSearchValue('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg">
            <Image
              src="/images/logo.jpg"
              alt="Kantera"
              width={36}
              height={36}
              loading="eager"
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-foreground">Kantera</span>
        </a>

        {/* Search bar - Desktop */}
        <div className="hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              key="desktop-search"
              type="text"
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setShowSearchResults(searchResults.length > 0)}
              suppressHydrationWarning={true}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                {searchResults.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      handleProductClick(product)
                    }}
                    className="block p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">${product.price.toLocaleString()} / {product.unit}</p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {product.category_label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nav links - Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted md:hidden"
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              key="mobile-search"
              type="text"
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              suppressHydrationWarning={true}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="mt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
