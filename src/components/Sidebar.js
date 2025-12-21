
        
        "use client";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { BsGift, BsPlusSquare } from "react-icons/bs";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import Image from "next/image";
import { FaHouseUser } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { IoMdDocument } from "react-icons/io";
import { BsRocketTakeoffFill } from "react-icons/bs";


import { IoPerson } from "react-icons/io5";

export default function Sidebar({
  isOpen,
  onToggle,
  activeItem,
  onItemClick,
  userType = "user", // 'user' or 'partner'
}) {
  const getUserMenuItems = (type) => {
    if (type === "partner") {
      return [
        { id: "dashboard", label: "Dashboard", icon: <FaHouseUser size={14} /> },
        { id: "scan-member", label: "Scan Member", icon: <BsRocketTakeoffFill size={14} /> },
        { id: "edit-profile", label: "Edit Profile", icon: <IoMdDocument size={14} />  },
        { id: "signout", label: "Sign Out", icon: <IoPerson size={14} /> },
      ];
    } else {
      return [
        { id: "partner-dashboard", label: "Dashboard", icon: <FaHouseUser size={14} /> },
        { id: "offers", label: "Offers", icon: <BsRocketTakeoffFill  size={14} /> },
        { id: "create", label: "Create ID", icon: <IoMdDocument size={14} /> },
        { id: "signout", label: "Sign Out", icon: <IoPerson size={14} /> },
      ];
    }
  };

  const menuItems = getUserMenuItems(userType);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 bg-[#001730] p-2 rounded text-white z-50 shadow-lg"
        onClick={onToggle}
      >
        <FiMenu />
      </button>

      {/* Sidebar */}
      <aside
      style={{borderRadius: "7px"}}
        className={`fixed md:sticky top-0 h-full md:h-[91vh] m-2 transition-all duration-300
           border border-gray-100
       bg-gradient-to-b 
        from-gray-200 to-gray-500
        shadow-xl p-5  border-radius[7px] flex flex-col justify-between rounded-md overflow-hidden z-40
        ${isOpen ? "left-0 w-60" : "-left-full w-0 md:left-0 md:w-48"}
      `}
      >
        {/* Top Section */}
        <div className="flex flex-col space-y-4">
          {/* Logo */}
          <div className="mx-auto mt-1 mb-1">
            <Image
              src="/images/Al-asmakh.png"
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-60"></div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`flex items-center gap-3 py-2 px-2 w-full text-xs transition-all duration-200 ${
                  activeItem === item.id
                    ? "bg-white text-gray-900 shadow "
                    : "text-black hover:bg-white/40 w-full "
                }`}
                style={{ borderRadius: "5px" }}
              >
                <span className="bg-[#001730] text-white p-1 rounded">
                  {item.icon}
                </span>
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3 mt-8">
          <button
            style={{ borderRadius: "5px" }}
            className="w-full py-2 text-[11px] bg-[#001730] text-white font-medium "
          >
            DOWNLOAD ID
          </button>

          {/* Help Box */}
          <div
            className="bg-[#001730] text-white  h-32 p-3 flex flex-col justify-end relative overflow-hidden"
            style={{
              backgroundImage: `url('/images/Background.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "5px",
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-white text-[#001730] p-1 rounded-sm">
                  <HiOutlineQuestionMarkCircle size={15} />
                </div>
              </div>
                     <span className="text-[12px] font-medium">Need help?</span>


              <button style={{borderRadius: "5px"}} className="bg-white text-black w-full py-2   borderradius[5px] text-[10px] font-semibold mt-1">
                RAISE TICKET
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-20"
          onClick={onToggle}
        />
      )}
    </>
  );
}
