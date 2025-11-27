"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToggleSize = "default" | "sm"

interface IOSToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean
  onChange?: (next: boolean) => void
  disabled?: boolean
  size?: ToggleSize
}

const sizeMap: Record<ToggleSize, { width: number; height: number; padding: number }> = {
  default: { width: 48, height: 26, padding: 2 },
  sm: { width: 40, height: 22, padding: 2 }
}

export const IOSToggle = ({
  checked,
  onChange,
  disabled,
  size = "default",
  className,
  ...props
}: IOSToggleProps) => {
  const config = sizeMap[size]
  const thumbSize = config.height - config.padding * 2

  const handleToggle = () => {
    if (disabled) return
    onChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={handleToggle}
      style={{
        width: config.width,
        height: config.height,
        minWidth: config.width,
        minHeight: config.height,
        maxWidth: config.width,
        maxHeight: config.height,
        borderRadius: config.height / 2,
        backgroundColor: checked ? "#34c759" : "#e5e5ea",
        borderColor: checked ? "#34c759" : "#e5e5ea",
        boxSizing: "border-box"
      }}
      className={cn(
        "relative inline-flex items-center shrink-0 grow-0 cursor-pointer border p-0 m-0 transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span
        style={{
          width: thumbSize,
          height: thumbSize,
          borderRadius: thumbSize / 2,
          transform: `translateX(${checked ? config.width - thumbSize - config.padding * 2 : 0}px)`,
          marginLeft: config.padding,
          boxSizing: "border-box"
        }}
        className="pointer-events-none block bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-out will-change-transform"
      />
    </button>
  )
}
