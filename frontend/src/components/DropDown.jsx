import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsHorizontal } from "react-icons/hi";

const Dropdown = ({ options }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                    <HiDotsHorizontal size={20} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" shadow-md rounded-md">
                {options.map((option, index) => (
                    <DropdownMenuItem
                        key={index}
                        className="cursor-pointer flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        onClick={option.onClick}
                    >
                        {option.icon && <span>{option.icon}</span>}
                        <span>{option.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Dropdown;
