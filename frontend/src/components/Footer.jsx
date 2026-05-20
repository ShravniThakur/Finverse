const Footer = () => {
    return (
        <div className="text-bodyText font-sans mt-20" style={{ borderTop: '1px solid rgba(127,90,240,0.15)' }}>
            <div className="md:grid grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                {[
                    {
                        title: "About Us",
                        content: "Finverse is your all-in-one finance companion, helping you manage wallets, track expenses, set budgets, and split bills effortlessly. Simplifying finances for students, professionals, and friends alike."
                    },
                    {
                        title: "Contact",
                        content: null,
                        isContact: true
                    },
                    {
                        title: "Privacy Policy",
                        content: "Your privacy matters. Finverse ensures that your financial data is securely stored and never shared without your consent."
                    },
                    {
                        title: "Terms & Conditions",
                        content: "By using Finverse, you agree to our terms and conditions, which govern the use of our services, features, and responsibilities."
                    },
                ].map(({ title, content, isContact }) => (
                    <div key={title} className="p-8 hover:bg-[rgba(127,90,240,0.05)] transition-all duration-300">
                        <p className="font-bold text-base text-[#7F5AF0] mb-4">{title}</p>
                        {isContact ? (
                            <div className="flex flex-col gap-2 text-sm text-[#8888A0]">
                                <p>📧 support@finverse.com</p>
                                <p>📞 +91 00000 00000</p>
                                <p>📍 Finverse, Pune, India</p>
                            </div>
                        ) : (
                            <p className="text-sm text-[#8888A0] leading-relaxed">{content}</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="text-center text-xs text-[#555570] py-5 px-4" style={{ borderTop: '1px solid rgba(127,90,240,0.1)' }}>
                © 2025 Finverse. All rights reserved.
            </div>
        </div>
    )
}

export default Footer