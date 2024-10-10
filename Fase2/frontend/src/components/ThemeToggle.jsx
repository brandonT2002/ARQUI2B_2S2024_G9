import { useEffect } from 'react';
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="hidden"
                onChange={toggleTheme}
                checked={theme === 'dark'}
            />
            <span className="w-22 h-11 flex items-center bg-gray-200 dark:bg-panel_bg-dark rounded-lg py-1 px-2 justify-between">
                <div className='dark:bg-panel_bg-dark bg-panel_bg-light p-2 rounded-md'>
                    <FiSun className={`text-text-light dark:text-text-dark transition-opacity`} size={17} />
                </div>
                <div className='bg-gray-200 dark:bg-background-dark p-2 rounded-md'>
                    <FiMoon className={`text-text-light dark:text-gray-300 transition-opacity`} size={17} />
                </div>
            </span>
        </label>
    );
}

export default ThemeToggle;
