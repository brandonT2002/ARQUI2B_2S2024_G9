import { LuChevronFirst, LuChevronLast } from "react-icons/lu"
import { createContext, useContext, useState } from "react"
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'; // Importa NavLink
import { IoCarSportSharp } from "react-icons/io5";
import Modal from "./Modal";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-panel_bg-light dark:bg-panel_bg-dark border-border-light dark:border-border-dark/40 border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        {/* <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} /> */}
                        <IoCarSportSharp size={38} color="#ffffff" className={`overflow-hidden transition-all ${expanded ? "w-10" : "w-0"}`} />
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-subpanel_bg-light dark:bg-subpanel_bg-dark hover:bg-gray-100 text-text-light dark:text-text-dark">
                            {expanded ? <LuChevronFirst size={24} /> : <LuChevronLast size={24} />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>

                    {/* <div className="flex p-3 dark:border-border-dark/60 text-[#a7a6a7] items-center justify-center">
                        <IoMdInformationCircle size={35} />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"} `}>
                            <div>
                                <h4 className="font-semibold">Información</h4>
                            </div>
                        </div>
                    </div> */}
                    <Modal expanded={expanded}/>
                </nav>
            </aside>
        </>
    )
}

export function SidebarItem({ icon, text, to, alert }) {
    const { expanded } = useContext(SidebarContext)
    return (
        <li className="relative">
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? 'bg-[#5161d3]/40 text-[#6276ff]' : 'text-white/60'
                    }`
                }
            >
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>{text}</span>
                {alert && (
                    <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`}></div>
                )}
                {!expanded && (
                    <div className={`absolute left-full rounded-md px-3 py-2 ml-6 bg-[#6276ff]/40 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                        {text}
                    </div>
                )}
            </NavLink>
        </li>
    )
}

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

SidebarItem.propTypes = {
    icon: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    to: PropTypes.string,
    alert: PropTypes.bool,
};