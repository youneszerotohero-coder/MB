import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import ProductCard from "../../components/productCard"
import { getProductImageUrl } from '@/utils/imageUtils'

// products will be fetched from backend

const colors = [
  { name: "Black", value: "bg-black" },
  { name: "White", value: "bg-white border border-gray-300" },
  { name: "Brown", value: "bg-amber-800" },
  { name: "Beige", value: "bg-[#C8B28D]" },
  { name: "Blue", value: "bg-blue-600" },
  { name: "Green", value: "bg-green-600" },
]

const sizes = ["Small", "Medium", "Large"]
const categories = ["Tote Bags", "Crossbody Bags", "Clutches", "Backpacks"]

function ProductsGrid({ filters, currentPage, setCurrentPage }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', { ...filters, page: currentPage }],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      if (filters.searchTerm && filters.searchTerm.trim()) {
        params.search = filters.searchTerm.trim()
      }
      if (filters.priceRange && filters.priceRange[0] > 0) {
        params.minPrice = filters.priceRange[0]
      }
      if (filters.priceRange && filters.priceRange[1] < 1000) {
        params.maxPrice = filters.priceRange[1]
      }
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key]
        }
      })
      
      const res = await api.get('/products', { params })
      return res.data.data
    }
  })

  if (isLoading) return (
    <div className="p-8 text-center">
      <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8B28D]"></div>
        <span>Loading products...</span>
      </div>
    </div>
  )
  
  if (isError) return (
    <div className="p-8 text-center">
      <div className="text-red-600">Error loading products: {error?.message}</div>
      <button 
        onClick={() => refetch()} 
        className="mt-4 px-4 py-2 bg-[#C8B28D] text-white rounded hover:bg-[#b49e77]"
      >
        Try Again
      </button>
    </div>
  )

  const products = data?.products || []
  const pagination = data?.pagination || {}

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No products found matching your criteria.</p>
        <div className="mt-4 text-sm text-gray-400">
          <p>Debug info:</p>
          <p>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}</p>
          <p>Current filters: {JSON.stringify(filters)}</p>
          <p>Response data: {JSON.stringify(data)}</p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-[#C8B28D] text-white rounded hover:bg-[#b49e77]"
        >
          Refresh Products
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name || 'Unnamed Product'}
            image={getProductImageUrl(product)}
            price={Number(product.price || product.finalPrice || 0)}
          />
        ))}
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="hidden sm:flex bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
            const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i
            if (pageNum > pagination.totalPages) return null
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? "bg-[#C8B28D] text-white hover:bg-[#b49e77]" : ""}
              >
                {pageNum}
              </Button>
            )
          })}
          
          {pagination.totalPages > 5 && currentPage < pagination.totalPages - 2 && (
            <>
              <span className="px-2 hidden sm:inline">...</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(pagination.totalPages)}
                className="hidden sm:inline-flex"
              >
                {pagination.totalPages}
              </Button>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage >= pagination.totalPages}
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            className="hidden sm:flex bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [selectedCategories, setSelectedCategories] = useState(["Crossbody Bags"])
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange)
    setCurrentPage(1)
  }

  const filters = {
    searchTerm,
    priceRange,
    selectedSize,
    selectedCategories
  }

  return (
    <div className="mt-16 min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-[#C8B28D] text-white hover:bg-[#b49e77]"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          <div
            className={`
            ${showMobileFilters ? "fixed inset-0 z-50 bg-black bg-opacity-50 md:relative md:bg-transparent" : "hidden md:block"}
          `}
          >
            <div
              className={`
              ${showMobileFilters ? "fixed left-0 top-0 h-full w-full bg-white transform transition-transform" : "w-80 bg-white"}
              p-6 rounded-lg shadow-sm h-fit md:h-fit overflow-y-auto
            `}
            >
              <div className="flex justify-between items-center mb-6 md:block">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)} className="md:hidden">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bags..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">Price</h3>
                <div className="px-2">
                  <Slider value={priceRange} onValueChange={handlePriceChange} max={1000} step={10} className="mb-4" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={`${selectedSize === size ? "bg-[#C8B28D] text-white hover:bg-[#b49e77]" : ""} flex-1 min-w-0 sm:flex-none`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full ${color.value} hover:ring-2 hover:ring-gray-300`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-[#C8B28D] text-white hover:bg-[#b49e77]"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <ProductsGrid 
              filters={filters} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
