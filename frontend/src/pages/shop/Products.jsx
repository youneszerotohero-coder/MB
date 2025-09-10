import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import ProductCard from "../../components/productCard"

// products will be fetched from backend

const colors = [
  { name: "Black", value: "bg-black" },
  { name: "White", value: "bg-white border border-gray-300" },
  { name: "Brown", value: "bg-amber-800" },
  { name: "Beige", value: "bg-amber-200" },
  { name: "Blue", value: "bg-blue-600" },
  { name: "Green", value: "bg-green-600" },
]

const sizes = ["Small", "Medium", "Large"]
const categories = ["Tote Bags", "Crossbody Bags", "Clutches", "Backpacks"]

function ProductsGrid() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', { page: 1, limit: 12 }],
    queryFn: async () => {
      const res = await api.get('/products', { params: { page: 1, limit: 12 } })
      return res.data.data || { products: res.data.products || [], pagination: res.data.pagination }
    }
  })

  if (isLoading) return <div className="p-8 text-center">Loading products...</div>
  if (isError) return <div className="p-8 text-center text-red-600">Error loading products: {error?.message}</div>

  // Handle different possible response shapes
  const products = Array.isArray(data.products) ? data.products : data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          image={(product.images && product.images[0] && product.images[0].url) || product.image || product.thumbnail || ''}
          price={product.price || product.finalPrice || 0}
        />
      ))}
    </div>
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
  }

  return (
    <div className="mt-16 min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-amber-200 text-amber-800 hover:bg-amber-300"
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-4">Price</h3>
                <div className="px-2">
                  <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="mb-4" />
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
                      className={`${selectedSize === size ? "bg-amber-200 text-amber-800 hover:bg-amber-300" : ""} flex-1 min-w-0 sm:flex-none`}
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
                className="w-full bg-amber-200 text-amber-800 hover:bg-amber-300"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <ProductsGrid />

            <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
              <Button variant="outline" size="sm" disabled className="hidden sm:flex bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="bg-amber-200 text-amber-800">
                1
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(2)}>
                2
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(3)} className="hidden sm:inline-flex">
                3
              </Button>
              <span className="px-2 hidden sm:inline">...</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(10)} className="hidden sm:inline-flex">
                10
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}