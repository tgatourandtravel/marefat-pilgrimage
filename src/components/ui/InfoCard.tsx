import React from "react";
import { BaseComponentProps } from "@/design-system/types";
import { Card } from "./Card";

export interface InfoCardProps extends BaseComponentProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  className = "",
  ...props
}) => {
  return (
    <Card
      variant="elevated"
      padding="md"
      className={`text-center ${className}`}
      {...props}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-gold">{icon}</div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal/60">
            {label}
          </p>
          <p className="text-sm font-semibold text-charcoal">{value}</p>
          {subtitle && (
            <p className="text-xs text-charcoal/60">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
