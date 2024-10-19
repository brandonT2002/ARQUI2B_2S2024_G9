import PropTypes from 'prop-types';
import { PiUserCircleDuotone } from "react-icons/pi";

export function ItemName({ name, number }) {
    return (
        <div className='w-full flex flex-row px-6 py-3 justify-between rounded-lg hover:bg-sub-dark transition-transform hover:transition-all ease-in-out duration-150'>
            <div className='flex flex-row gap-2 items-center justify-center'>
                <PiUserCircleDuotone size={30} color='#6276ff' />
                <span className='font-medium'>{name}</span>
            </div>
            <span className='px-3 py-1 border-2 border-[#6276ff] rounded-md w-fit text-[#6276ff] font-semibold'>{number}</span>
        </div>
    )
}

ItemName.propTypes = {
    name: PropTypes.node,
    number: PropTypes.node,
};