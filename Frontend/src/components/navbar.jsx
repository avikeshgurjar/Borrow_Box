import { useState } from "react";






const Navbar = () => {
  return (
    <div>
      <div className="w-dvw ">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <Package className="w-6 h-6" />
          <span>BorrowBox</span>
        </Link>
        
      </div>
    </div>
  )
  
}