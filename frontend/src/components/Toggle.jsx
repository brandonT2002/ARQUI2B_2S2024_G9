import { useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const Toggle = () => {
    const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => setIsOn(!isOn);

    return (
        <div className="bg-panel_bg-dark p-6 rounded-lg">
            <div className="text-gray-300 mb-4 text-lg font-bold">Iluminación</div>
            <div className="flex space-x-4 text-white w-full">
                <button
                    onClick={toggleSwitch}
                    className={`flex flex-col gap-2 p-4 items-center justify-center w-1/2  rounded-md transition-colors duration-200 ease-in-out ${isOn ? 'bg-[#6366f1]' : 'bg-[#2C2C2E]'
                        }`}
                >
                    <FiSun className="mr-2" size={30} />
                    <span>Encender</span>
                </button>
                <button
                    onClick={toggleSwitch}
                    className={`flex flex-col gap-2 p-4  items-center justify-center w-1/2 rounded-md transition-colors duration-200 ease-in-out ${isOn ? 'bg-[#2C2C2E]' : 'bg-[#6366f1]'
                        }`}
                >
                    <FiMoon className="mr-2" size={30}/>
                    <span>Apagar</span>
                </button>
            </div>
        </div>
    );
};

export default Toggle;