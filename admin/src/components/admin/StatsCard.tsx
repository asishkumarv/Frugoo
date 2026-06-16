import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "primary" | "secondary" | "accent" | "muted";
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  muted: "bg-muted text-muted-foreground",
};

const StatsCard = ({ title, value, icon: Icon, trend, trendUp, variant = "primary" }: StatsCardProps) => (
  <div className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h3 className="text-2xl font-display font-bold text-foreground mt-1">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? "text-primary" : "text-destructive"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default StatsCard;
