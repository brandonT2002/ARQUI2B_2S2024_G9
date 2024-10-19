import { useState, useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { ItemName } from "./ItemNames";
import { IoCloseCircleSharp } from "react-icons/io5";

export default function Modal({expanded}) {
    const [modal, setModal] = useState(false);
    const [animate, setAnimate] = useState(false);

    const toggleModal = () => {
        if (modal) {
            setAnimate(false);
            setTimeout(() => setModal(false), 300);
        } else {
            setModal(true);
            setTimeout(() => setAnimate(true), 10);
        }
    };

    useEffect(() => {
        if (modal) {
            document.body.classList.add('active-modal')
        } else {
            document.body.classList.remove('active-modal')
        }
    }, [modal]);

    return (
        <>
            <button onClick={toggleModal} className="flex p-3 dark:border-border-dark/60 text-[#a7a6a7] items-center justify-center">
                <IoMdInformationCircle size={35} />
                <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"} `}>
                    <div>
                        <h4 className="font-semibold">Información</h4>
                    </div>
                </div>
            </button>
            {modal && (
                <div className="w-full h-full top-0 left-0 right-0 bottom-0 fixed z-10">
                    <div
                        onClick={toggleModal}
                        className={`w-full h-full top-0 left-0 right-0 bottom-0 fixed bg-black transition-opacity duration-300 ease-in-out ${animate ? 'opacity-50' : 'opacity-0'
                            }`}
                    ></div>
                    <div
                        className={`absolute bg-subpanel_bg-dark/80 text-white top-1/4 left-[35%] py-3 px-3 w-[550px] min-w-[300px] rounded-md transition-all duration-300 ease-in-out ${animate ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
                            }`}
                    >
                        <h2 className="font-semibold ">Grupo 09</h2>
                        <p>
                            <ItemName name="Miguel Fernando Guirola Villalta" number="201700772" />
                            <ItemName name="Dyllan José Rodrigo García Mejía" number="201907774" />
                            <ItemName name="Joab Israel Ajsivinac Ajsivinac" number="202200135" />
                            <ItemName name="Brandon Andy Jefferson Tejaxún Pichiyá" number="202112030" />
                            <ItemName name="Marcos Geovani Josías Pérez Secay" number="201903878" />
                            <ItemName name="Eduardo Abraham Barillas del Aguila" number="201903342" />
                        </p>
                        <button className="absolute -top-1 -right-2 py-1" onClick={toggleModal}>
                            <IoCloseCircleSharp size={25}/>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}