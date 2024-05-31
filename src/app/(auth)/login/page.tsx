import type { NextPage } from "next";
import FormLogin from "./form-login";

const Page: NextPage = () => {

    return (
        <>
            <div className="w-dvw h-dvh flex items-center justify-center">
                        <FormLogin/>
            </div>
        </>
    )
}

export default Page