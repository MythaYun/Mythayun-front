declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react'
  
  interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
  }
  
  type Icon = ComponentType<LucideProps>
  
  export const Check: Icon
  export const CheckCircle: Icon
  export const ChevronDown: Icon
  export const ChevronUp: Icon
  // Add any other icons you use from lucide-react here
}
