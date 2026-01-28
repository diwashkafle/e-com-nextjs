"use client"
import * as LucideIcons from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import SalesIcon from '@/lib/helper/Sales-icon'

export interface InfoContainerProps {
  total: number | string | undefined
  name: string | undefined
  iconName: keyof typeof LucideIcons // This is now a string type
  trend?: string
  color?: "blue" | "green" | "purple" | "orange"
}

const colorMap = {
  blue: "text-blue-600 bg-blue-50 border-blue-100",
  green: "text-emerald-600 bg-emerald-50 border-emerald-100",
  purple: "text-purple-600 bg-purple-50 border-purple-100",
  orange: "text-orange-600 bg-orange-50 border-orange-100",
}

const InfoContainer = ({ total, name, iconName, trend, color = "blue" }: InfoContainerProps) => {
  // Dynamically get the icon component from the library
  const Icon = (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.HelpCircle

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{name}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 flex items-center gap-1">
            {name === "Total Revenue" && <SalesIcon/>}
            {total?.toLocaleString() ?? '0'}</h3>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <LucideIcons.TrendingUp className="w-3 h-3" />
              <span>{trend} from last month</span>
            </div>
          )}
        </div>

        <div className={cn("h-12 w-12 flex items-center justify-center self-start rounded-lg border", colorMap[color])}>
          {
            name!== "Total Revenue" ? <Icon/> : <SalesIcon size='2xl'/>
          }
        </div>
      </div>
    </motion.div>
  )
}

export default InfoContainer