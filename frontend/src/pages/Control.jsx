import { RiLockPasswordFill } from "react-icons/ri";
import Toggle from "../components/Toggle";
import { Button } from "../components/Button";
function Control() {

    return (
        <div className='flex h-screen bg-background-light dark:bg-background-dark w-full items-center justify-center'>
            <div className='flex w-[92%] h-full pt-4 flex-col gap-4 pb-5 ml-1'>
                <div className="flex w-full justify-between h-10">
                    <h2 className="text-text-light dark:text-text-dark text-2xl font-bold">Control</h2>
                </div>
                <div className="flex gap-3 w-full flex-col h-full">
                    <div className="bg-panel_bg-dark w-full flex h-fit p-4 flex-col gap-3 text-white rounded-md">
                        <h2 className="text-lg font-bold">Acceso</h2>
                        <div className="flex flex-row w-full justify-between items-center">
                            <input
                                type="text"
                                placeholder="Usuario"
                                className="bg-subpanel_bg-dark p-2 rounded-md flex-grow mr-2"
                            />
                            <Button
                                icon={<RiLockPasswordFill size={20} />}
                                label="Ingresar"
                                onClick={() => console.log('Ingresar')}
                                className="w-auto" // Puedes ajustar el ancho del botón aquí si es necesario
                            />
                        </div>
                    </div>
                    <Toggle />
                </div>
            </div>
        </div>
    )
}

export default Control