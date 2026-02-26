"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"

interface Category {
  id: string
  name: string
  label: string
  created_at: string
  updated_at: string
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    label: ''
  })

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  const saveCategory = async (categoryData: Partial<Category>) => {
    try {
      const url = editingCategory ? '/api/admin/categories' : '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCategory ? { ...categoryData, id: editingCategory.id } : categoryData)
      })

      if (response.ok) {
        await fetchCategories()
        setEditingCategory(null)
        setIsCreating(false)
        setFormData({ name: '', label: '' })
      } else {
        alert('Error al guardar categoría')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error al guardar categoría')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCategories()
      } else {
        alert('Error al eliminar categoría')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error al eliminar categoría')
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      label: category.label
    })
    
    // Scroll automático al formulario de edición después de un breve retraso
    setTimeout(() => {
      const formElement = document.getElementById('category-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const startCreate = () => {
    setIsCreating(true)
    setFormData({ name: '', label: '' })
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setIsCreating(false)
    setFormData({ name: '', label: '' })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-muted-foreground">Cargando categorías...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gestión de Categorías</h2>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Form for creating/editing */}
      {(isCreating || editingCategory) && (
        <div id="category-form" className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isCreating ? 'Nueva Categoría' : 'Editar Categoría'}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre (URL)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ej: pisos-spc"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Etiqueta</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ej: Pisos SPC"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => saveCategory(formData)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? 'Crear' : 'Guardar'}
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-500">
                    {category.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
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
    </div>
  )
}
