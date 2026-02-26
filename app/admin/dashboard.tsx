"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, Product } from "@/lib/supabase"
import { CategoriesManager } from "@/components/admin/categories-manager"

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      
      if (data.error) {
        console.error('Error fetching products:', data.error)
        return
      }

      setProducts(data.products || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.error) {
        console.error('Error deleting product:', data.error)
        alert('Error al eliminar producto')
        return
      }

      await fetchProducts()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar producto')
    }
  }

  const handleEdit = (product: Product) => {
    // Limpiar URLs temporales del producto
    const cleanedProduct = {
      ...product,
      images: product.images?.filter(img => !img.startsWith('blob:')) || []
    }
    setEditingProduct(cleanedProduct)
    
    // Scroll automático al formulario de edición después de un breve retraso
    setTimeout(() => {
      const formElement = document.getElementById('product-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleSave = async (product: Partial<Product>) => {
    try {
      const isUpdate = !!product.id
      const url = isUpdate ? `/api/admin/products?id=${product.id}` : '/api/admin/products'
      const method = isUpdate ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
      
      const data = await response.json()
      
      if (data.error) {
        console.error('Error saving product:', data.error)
        alert('Error al guardar producto')
        return
      }

      setEditingProduct(null)
      setIsCreating(false)
      await fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar producto')
    }
  }

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; max-age=0'
    window.location.href = '/admin'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categorías
              </button>
            </nav>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Nuevo Producto
                </button>
              </div>

              {(isCreating || editingProduct) && (
                <div id="product-form">
                  <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => {
                      setEditingProduct(null)
                      setIsCreating(false)
                    }}
                  />
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <li key={product.id}>
                      <div className="px-4 py-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${product.price.toLocaleString()} / {product.unit}
                          </p>
                          <p className="text-sm text-gray-500">
                            Categoría: {product.category_label}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && <CategoriesManager />}
        </div>
      </div>
    </div>
  )
}

function ProductForm({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product | null
  onSave: (product: Partial<Product>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    unit: product?.unit || 'unidad',
    images: product?.images || [],
    category: product?.category || '',
    category_label: product?.category_label || '',
    stock: product?.stock || 1,
    measure: product?.measure || '',
    description: product?.description || '',
    variants: product?.variants || []
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string, name: string, label: string}>>([])
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [newVariant, setNewVariant] = useState({ measure: '', price: 0, unit: '', stock: 1 })

  // Cargar categorías existentes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        const data = await response.json()
        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Procesar imágenes subidas - agregar a las existentes, no reemplazar
      let processedImages = [...formData.images]
      
      // Si hay archivos de imagen, subirlos
      if (imageFiles.length > 0) {
        console.log('Uploading images:', imageFiles.map(f => f.name))
        
        const uploadPromises = imageFiles.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          
          console.log('Uploading file:', file.name, file.type)
          
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
          })
          
          console.log('Upload response status:', response.status)
          
          if (!response.ok) {
            const errorData = await response.json()
            console.error('Upload error response:', errorData)
            throw new Error('Failed to upload image')
          }
          
          const data = await response.json()
          console.log('Upload success:', data)
          return data.url
        })
        
        const newImageUrls = await Promise.all(uploadPromises)
        console.log('All uploaded URLs:', newImageUrls)
        processedImages = [...processedImages, ...newImageUrls]
      }
      
      // Incluir el ID si es una edición
      const productData = {
        ...formData,
        images: processedImages
      }
      
      // Eliminar variants si está vacío para evitar errores de base de datos
      if (!productData.variants || productData.variants.length === 0) {
        delete productData.variants
      }
      
      if (product?.id) {
        productData.id = product.id
      }
      
      console.log('Final product data to save:', JSON.stringify(productData, null, 2))
      
      onSave(productData)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error al subir las imágenes. Por favor, intenta de nuevo.')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && 
      (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp')
    )
    
    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles])
    }
  }

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleCategoryChange = (categorySlug: string) => {
    const selectedCategory = categories.find(cat => cat.name === categorySlug)
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        category: selectedCategory.name,
        category_label: selectedCategory.label
      }))
    }
  }

  const addVariant = () => {
    if (newVariant.measure && newVariant.price > 0 && newVariant.unit) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant, id: Date.now().toString() }]
      }))
      setNewVariant({ measure: '', price: 0, unit: '' })
      setShowVariantForm(false)
    }
  }

  const removeVariant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }))
  }

  return (
    <div className="bg-white shadow sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidad</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medidas</label>
              <input
                type="text"
                value={formData.measure || ''}
                onChange={(e) => setFormData({ ...formData, measure: e.target.value })}
                placeholder="Ej: 1.20m, 50cm, 2x1m"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Descripción */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Descripción del Producto</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe las características, usos y beneficios del producto..."
            />
          </div>

          {/* Subida de imágenes */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Imágenes del Producto</label>
            <div className="mt-1">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v16m-4 8h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Seleccionar imágenes</span>
                      <input
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileInput}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta aquí</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP hasta 10MB cada una
                  </p>
                </div>
              </div>

              {/* Vista previa de imágenes */}
              {(imageFiles.length > 0 || formData.images.length > 0) && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes seleccionadas:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Imágenes existentes */}
                    {formData.images.map((img, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                          title="Eliminar imagen"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xs">Imagen {index + 1}</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Nuevas imágenes */}
                    {imageFiles.map((file, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nueva imagen ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                          title="Eliminar imagen"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          Nueva
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Variantes de Medidas */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Variantes de Medida y Precio</label>
              <button
                type="button"
                onClick={() => setShowVariantForm(!showVariantForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                + Agregar Variante
              </button>
            </div>

            {/* Formulario para nueva variante */}
            {showVariantForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medida</label>
                    <input
                      type="text"
                      value={newVariant.measure}
                      onChange={(e) => setNewVariant({ ...newVariant, measure: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ej: 20x30cm, 1m²"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                      type="number"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unidad</label>
                    <input
                      type="text"
                      value={newVariant.unit}
                      onChange={(e) => setNewVariant({ ...newVariant, unit: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ej: unidad, m², caja"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowVariantForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-medium mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Agregar Variante
                  </button>
                </div>
              </div>
            )}

            {/* Lista de variantes existentes */}
            {formData.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Variantes configuradas:</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {formData.variants.map((variant) => (
                    <div key={variant.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{variant.measure}</div>
                        <div className="text-green-600 font-bold">${variant.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">/ {variant.unit}</div>
                        <div className={`text-xs font-medium ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variant.stock > 0 ? `Stock: ${variant.stock}` : 'Sin stock'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
