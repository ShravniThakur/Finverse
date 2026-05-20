
const Footer = () => {
    return (
        <div className="text-bodyText font-serif">
            <div className="mt-20">
                <div className="md:grid grid-cols-2 lg:grid-cols-4">
                    <div className="p-10 hover:bg-card transition-all duration-500">
                        <p className="font-bold text-xl text-purple-300 text-center pb-5">About Us</p>
                        <p>
                            Finverse is your all-in
                            -one finance companion,
                            helping you manage
                            wallets, track expenses,
                            set budgets, and
                            split bills effortlessly.
                            Simplifying finances
                            for students,
                            professionals, and
                            friends alike.</p>
                    </div>
                    <div className="p-10 hover:bg-card transition-all duration-500">
                        <p className="font-bold text-xl text-purple-300 text-center pb-5">Contact</p>
                        <p>• Email:<br></br>
                            support@finverse.com
                            <br></br><br></br>
                            • Phone:<br></br>
                            +91 00000 00000
                            <br></br><br></br>
                            • Address:<br></br>
                            Finverse, Pune, India</p>
                    </div>
                    <div className="p-10 hover:bg-card transition-all duration-500">
                        <p className="font-bold text-xl text-purple-300 text-center pb-5">Privacy Policy</p>
                        <p>
                            Your privacy
                            matters. Finverse
                            ensures that your
                            financial data is
                            securely stored
                            and never shared
                            without your
                            consent.</p>
                    </div>
                    <div className="p-10 hover:bg-card transition-all duration-500">
                        <p className="font-bold text-xl text-purple-300 text-center pb-5">Terms & Conditions</p>
                        <p>
                            By using Finverse,
                            you agree to
                            our terms and
                            conditions, which
                            govern the use of
                            our services,
                            features, and
                            responsibilities.</p>
                    </div>
                </div>
            </div>
            <div className="text-center border-t border-borderColour p-5">
                copyright @finverse
            </div>
        </div>
    )
}
export default Footer