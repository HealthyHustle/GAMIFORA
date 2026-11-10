import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'gold' | 'green' | 'wood' | 'cream' | 'danger'
type Size = 'md' | 'lg' | 'sm'

interface Common {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  block?: boolean
  children: ReactNode
  className?: string
}

type ButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { to?: undefined }
type LinkProps = Common & { to: string; disabled?: boolean; onClick?: () => void; id?: string }

export function GameButton(props: ButtonProps | LinkProps) {
  const { variant = 'gold', size = 'md', icon, iconRight, block, children, className = '' } = props
  const cls = `btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`
  const inner = (
    <>
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
      {iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
    </>
  )

  if ('to' in props && props.to !== undefined) {
    if (props.disabled) {
      return (
        <span className={`${cls} is-disabled`} role="link" aria-disabled="true" id={props.id}>
          {inner}
        </span>
      )
    }
    return (
      <Link to={props.to} className={cls} onClick={props.onClick} id={props.id}>
        {inner}
      </Link>
    )
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    iconRight: _ir,
    block: _b,
    children: _c,
    className: _cn,
    to: _to,
    type = 'button',
    ...rest
  } = props as ButtonProps
  void _v
  void _s
  void _i
  void _ir
  void _b
  void _c
  void _cn
  void _to

  return (
    <button type={type} className={cls} {...rest}>
      {inner}
    </button>
  )
}

