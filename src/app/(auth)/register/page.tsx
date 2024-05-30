import type { NextPage } from "next";
import FormRegister from "./form-register";




const Page: NextPage = () => {

    return (
        <>
            <div className="w-dvw h-dvh bg-gray-100 flex items-center justify-center">
                        <FormRegister />
            </div>
        </>
    )
}

export default Page