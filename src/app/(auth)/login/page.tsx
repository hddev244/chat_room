import type { NextPage } from "next";
import FormLogin from "./form-login";

const Page: NextPage = () => {

    return (
        <>
            <div className="w-dvw h-dvh bg-gray-100 flex items-center justify-center">
                        <FormLogin/>
            </div>
        </>
    )
}

export default Page