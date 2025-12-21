"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function DetailsButton({
    text = "Details",
    href = "/propertydetails",
    bgColor = "#10284C",
    hoverColor = "#002d52",
    className = "",
    size = "default",
    iconSize = 12,
    fullWidth = false,
    onClick,
    ...props
}) {
    // Size presets
    const sizeClasses = {
        small: "text-xs px-3 py-1.5",
        default: "text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl px-3 md:px-4 lg:px-5 xl:px-5 2xl:px-6 3xl:px-7 4xl:px-8 5xl:px-10 py-1.5 md:py-1.5 lg:py-2 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-4 5xl:py-5",
        medium: "text-sm px-4 py-2",
        large: "text-base px-6 py-3",
    };

    const iconSizeClasses = {
        small: "w-3 h-3",
        default: "w-3 h-3 md:w-3 md:h-3 lg:w-[14px] lg:h-[14px] xl:w-[14px] xl:h-[14px] 2xl:w-[18px] 2xl:h-[18px] 3xl:w-[22px] 3xl:h-[22px] 4xl:w-[26px] 4xl:h-[26px] 5xl:w-[32px] 5xl:h-[32px]",
        medium: "w-4 h-4",
        large: "w-5 h-5",
    };

    const baseClasses = `
    text-white 
    ${sizeClasses[size]} 
    font-medium 
    ${fullWidth ? "w-full" : "w-fit"} 
    rounded-md 
    flex 
    items-center 
    justify-between 
    gap-2 
    shadow-lg 
    transition-all 
    duration-300 
    ${className}
  `.trim().replace(/\s+/g, " ");

    const buttonContent = (
        <>
            <span>{text}</span>
            <FaArrowRight
                size={iconSize}
                className={iconSizeClasses[size]}
            />
        </>
    );

    if (onClick || !href) {
        return (
            <button
                className={baseClasses}
                onClick={onClick}
                style={{
                    backgroundColor: bgColor,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverColor;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = bgColor;
                }}
                {...props}
            >
                {buttonContent}
            </button>
        );
    }

    return (
        <button
            className={baseClasses}
            style={{
                backgroundColor: bgColor,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverColor;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = bgColor;
            }}
            {...props}
        >
            <Link
                href={href}
                className="flex items-center justify-between gap-2 w-full"
            >
                {buttonContent}
            </Link>
        </button>
    );
}

