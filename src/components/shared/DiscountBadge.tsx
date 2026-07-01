interface DiscountBadgeProps {
  discountPercent: number
}

export function DiscountBadge({ discountPercent }: DiscountBadgeProps) {
  return (
    <span className="inline-block px-1.5 py-0.5 text-xs font-bold text-[#d2efa9] bg-[#5c7e10] rounded-sm">
      -{discountPercent}%
    </span>
  )
}
