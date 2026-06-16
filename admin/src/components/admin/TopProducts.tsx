const defaultProducts = [
  { name: "Alphonso Mango Box", sales: 142, revenue: 28400 },
  { name: "Mixed Fruit Basket", sales: 98, revenue: 24500 },
  { name: "Organic Strawberries", sales: 87, revenue: 17400 },
  { name: "Fresh Orange Crate", sales: 76, revenue: 11400 },
  { name: "Dragon Fruit Premium", sales: 54, revenue: 16200 },
];

const TopProducts = ({ data = defaultProducts }: { data?: any[] }) => (
  <div className="bg-card rounded-xl shadow-card p-5 animate-fade-in">
    <h2 className="text-lg font-display font-bold text-foreground mb-4">Top Products</h2>
    <div className="space-y-3">
      {(data || defaultProducts).map((product, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sales} sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">₹{product.revenue.toLocaleString()}</p>
            <p className="text-xs text-primary font-medium">{product.trend || "+5%"}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopProducts;
