export default function SpinperBasic() {
    return (
        <div className="size-full flex justify-center items-center">
            <div
                className=" inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>
        </div>
    );
}