export default function Sun({
    size = 50,
    className,
}: {
    size: number;
    className?: string;
}) {
    return (
        <svg
            viewBox='0 0  50 50'
            width={size}
            height={size}
            className={className}
            xmlns='http://www.w3.org/2000/svg'
        >
            <polygon points='30,5 45,20 45,5' fill='transparent' />
            <polygon points='45,45 45,30 30,45' fill='transparent' />
            <polygon points='20,45 5,45 5,30' fill='transparent' />
            <polygon points='5,20 5,5 20,5' fill='transparent' />

            <polygon points='25,0 30,5 20,5' fill='transparent' />
            <polygon points='50,25 45,30 45,20' fill='transparent' />
            <polygon points='20,45 30,45 25,50' fill='transparent' />
            <polygon points='5,30 0,25 5,20' fill='transparent' />
            <circle
                cx='25'
                cy='25'
                r='20'
                strokeWidth='2'
            />
        </svg>
    );
}
