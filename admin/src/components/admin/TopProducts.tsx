const products = [
  { name: "Alphonso Mango Box", sold: 142, revenue: "₹28,400", trend: "+12%" },
  { name: "Mixed Fruit Basket", sold: 98, revenue: "₹24,500", trend: "+8%" },
  { name: "Organic Strawberries", sold: 87, revenue: "₹17,400", trend: "+22%" },
  { name: "Fresh Orange Crate", sold: 76, revenue: "₹11,400", trend: "+5%" },
  { name: "Dragon Fruit Premium", sold: 54, revenue: "₹16,200", trend: "+18%" },
];

const TopProducts = () => (
  <div className="bg-card rounded-xl shadow-card p-5 animate-fade-in">
    <h2 className="text-lg font-display font-bold text-foreground mb-4">Top Products</h2>
    <div className="space-y-3">
      {products.map((product, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sold} sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{product.revenue}</p>
            <p className="text-xs text-primary font-medium">{product.trend}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopProducts;
