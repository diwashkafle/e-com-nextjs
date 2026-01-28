
  import { RiAdminFill, RiShoppingBag3Fill } from "react-icons/ri";
  import { FaImages } from "react-icons/fa";
  import { FaBoxArchive } from "react-icons/fa6";
  import { FaUsers } from "react-icons/fa6";
import SalesIcon from "@/lib/helper/Sales-icon";
import Link from "next/link";
import { BsBoxFill } from "react-icons/bs";

  export function SideBar() {

    const items = [
        {
          title: "Products",
          url: "/admin/products",
          icon: BsBoxFill,
        },
        {
          title: "Banner",
          url: "/admin/banners",
          icon: FaImages,
        },
        {
          title: "Sales",
          url: "/admin/sales",
          icon:SalesIcon,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: FaUsers,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: RiShoppingBag3Fill,
        },
      ]

    return (
      <main className="md:w-50 sm:w-40 w-15  bg-gray-50 border-r border-gray-200 flex flex-col items-center sm:items-start">
            <section className="w-full">
                <Link href={'/admin'}>
                <div className="flex w-full items-center p-1 py-2 gap-1 border-b border-gray-200">
                    <RiAdminFill size={20}/>
                <h1 className="text-lg font-semibold hidden sm:flex">Admin</h1>
                </div>
                </Link>
                <div className="flex flex-col pt-4">
                {
                items.map((item,index)=>{
                    return (
                        <section key={item.title} className="hover:bg-gray-100 rounded-md cursor-pointer p-2">
                            <Link href={item.url} className="flex items-center gap-2">
                                <item.icon/>
                                <p className="sm:flex hidden">{item.title}</p>
                            </Link>
                        </section>
                    )
                })
            }
                </div>
            </section>
      </main>
    )
  }