import { Card, CardContent } from "@/components/ui/card";
import {ShoppingBag} from "lucide-react";

export default function ProductCard(props) {
  return (
                <Card className="overflow-hidden rounded-3xl shadow-md group">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={props.image}
                      alt={props.name}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 text-xs font-medium text-[#C8B28D] px-1 py-2 rounded-full shadow">
                      50%
                    </span>
                  </div>

                  {/* Content */}
                  <CardContent className="flex justify-between bg-[#C8B28D] px-4 py-4">
                    <div>
                      <p className="font-serif font-semibold text-white">
                        {props.name}
                      </p>
                      <p className="text-base font-medium text-white">
                        ${props.price.toFixed(2)}
                      </p>
                    </div>
                    <button className="h-10 rounded-[2px] bg-white text-[#C8B28D] rounded-full px-2">
                      <ShoppingBag className="h-6 w-6" />
                    </button>
                  </CardContent>
                </Card>
  );
}