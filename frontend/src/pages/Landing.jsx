import Footer from "../components/Footer"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router"

const Landing = () => {
    const navigate = useNavigate()

    return (
        <div className="text-bodyText font-serif">
            <div className="flex flex-col gap-15 m-10 text-bodyText font-serif">
                <div className="lg:flex gap-5">
                    <div className="mb-10">
                        <img src={assets.website.Finverse} className="w-[50%]"></img>
                        <div className="py-10">
                            <p className="text-3xl font-bold">
                                Finverse helps you track <span className="text-purple-300">transactions</span>,
                                manage <span className="text-purple-300">wallets</span>, and <span className="text-purple-300">split</span> expenses
                                effortlessly.
                            </p>
                            <br></br>
                            <p className="text-2xl font-bold">
                                Stay organized, stay in control,
                                and settle payments with confidence.
                            </p>
                            <p className="text-lg font-bold text-purple-300 mt-5">
                                Built for students, friends, and families who want clarity, not chaos.
                            </p>
                        </div>
                        <div>
                            <button onClick={() => {navigate('/login')}} className="bg-button px-7 py-3 rounded-full hover:bg-buttonHover duration-300">
                                <div className="flex gap-2">
                                    <p className="text-xl font-bold">GET STARTED  </p>
                                    <img src={assets.website.Arrow}></img>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-400">
                        <img src={assets.website.Landing}></img>
                    </div>
                </div>
                {/* Features */}
                <div>
                    <div className="text-center font-bold text-4xl"> FEATURES </div>
                    <p className="text-center p-5">Everything you need to track, split, budget, and grow your money — in one place.</p>
                    <div className="flex flex-col gap-5 md:grid grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.sidebar.Wallet}></img>
                                <p className="font-bold text-2xl text-purple-300">Wallet</p>
                            </div>
                            <p> Your money, always in control. Track wallet balance, credits, debits, and view a complete transaction history.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.sidebar.Expenses}></img>
                                <p className="font-bold text-2xl text-purple-300">Expenses</p>
                            </div>
                            <p> Know exactly where your money goes. Log expenses, categorize them, and monitor daily spending habits.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.sidebar.Budget}></img>
                                <p className="font-bold text-2xl text-purple-300">Budgets</p>
                            </div>
                            <p>Plan smarter, spend better. Set budgets, track limits, and avoid overspending with clear insights.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.sidebar.SplitBill}></img>
                                <p className="font-bold text-2xl text-purple-300">Splits</p>
                            </div>
                            <p> Fair and effortless bill splitting. Split expenses with friends or groups and keep track of who owes what. </p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.splitbill.SettleUp}></img>
                                <p className="font-bold text-2xl text-purple-300">Settlements</p>
                            </div>
                            <p> Clear dues without confusion. Settle split balances seamlessly and record clean settlement transactions. </p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.dashboard.QuickStats}></img>
                                <p className="font-bold text-2xl text-purple-300">Insights</p>
                            </div>
                            <p>  Turn data into decisions. Visualize spending with monthly charts and source-wise breakdowns.</p>
                        </div>
                    </div>
                </div>
                {/* How It Works */}
                <div>
                    <div className="text-center font-bold text-4xl"> HOW IT WORKS </div>
                    <p className="text-center p-5">Simple steps to smarter finance.</p>
                    <div className="flex flex-col gap-5 sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-10">
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.website.Arrow}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Login</p>
                            </div>
                            <p className="text-center">Secure access</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.Wallet}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Wallet</p>
                            </div>
                            <p className="text-center"> Manage funds</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.Expenses}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Expenses</p>
                            </div>
                            <p className="text-center"> Track spending</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.Budget}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Budgets</p>
                            </div>
                            <p className="text-center">Stay in control</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.SplitBill}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Splits</p>
                            </div>
                            <p className="text-center"> Share bills easily </p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.splitbill.SettleUp}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Settlements</p>
                            </div>
                            <p className="text-center"> Pay & receive </p>
                        </div>
                    </div>
                </div>
                {/* FAQs */}
                <div>
                    <div className="text-center font-bold text-4xl"> FAQs </div>
                    <p className="text-center p-5">Everything you need to know, explained simply.</p>
                    <div className="flex flex-col gap-5 md:grid grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8" src={assets.website.Question}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">What is Finverse</p>
                            </div>
                            <p> Finverse is a personal finance platform that helps you track wallet transactions, manage expenses, set budgets, and split bills seamlessly — all in one place.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.website.Question}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Is my financial data secure</p>
                            </div>
                            <p> Yes. Your data is protected using industry-standard security practices, and sensitive information is never shared with third parties.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.website.Question}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Can I split expenses with friends</p>
                            </div>
                            <p>Absolutely. Create groups, add expenses, and settle splits easily. Finverse keeps balances updated automatically.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.website.Question}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Do I need a bank account to use Finverse</p>
                            </div>
                            <p> No. Finverse works with an in-app wallet and manual expense tracking, so you stay in control without linking a bank account. </p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.website.Question}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Can I track my spending over time</p>
                            </div>
                            <p> Yes. View detailed transaction history, monthly summaries, and visual charts to understand where your money goes.</p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.website.Question}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Is Finverse free to use</p>
                            </div>
                            <p> Yes. All core features are available for free, with optional advanced features planned for the future.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5 md:flex-row gap-15">
                    <p className="md:w-[70%] text-xl">
                        Get started with <span className="text-purple-300 font-bold">Finverse</span> and simplify the way
                        you manage money. Whether it’s tracking daily
                        expenses, managing your wallet, or settling group
                        splits, Finverse helps you stay organized,
                        stress-free, and in control every day.
                    </p>
                    <div>
                        <button className="bg-button px-7 py-3 rounded-full hover:bg-buttonHover duration-300">
                            <div className="flex gap-2">
                                <p onClick={() => {navigate('/login')}} className="text-xl font-bold"> GET STARTED  </p>
                                <img src={assets.website.Arrow}></img>
                            </div>
                        </button>
                    </div>
                </div>
                {/* Testimonials */}
                <div>
                    <div className="text-center font-bold text-4xl"> Testimonials </div>

                    <div className="flex flex-col gap-5 md:grid grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.MyProfile}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Riya Sharma, Pune</p>
                            </div>
                            <p> “As a student
                                managing my monthly
                                allowance and group
                                trips, Finverse has
                                been a lifesaver.
                                Splitting bills with
                                friends is now so
                                simple, and I always
                                know where my
                                money is going!”
                            </p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex gap-3 justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.MyProfile}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Aditya Verma, Bangalore</p>
                            </div>
                            <p> “Finverse keeps my
                                finances organized
                                effortlessly. I can
                                track my wallet,
                                expenses, and even
                                plan budgets. It’s
                                like having a personal
                                finance assistant
                                in my pocket.”
                            </p>
                        </div>
                        <div className="flex flex-col gap-5 bg-card rounded-lg p-7 hover:bg-cardHover duration-300">
                            <div className="flex justify-center">
                                <img className="w-8 h-8" src={assets.sidebar.MyProfile}></img>
                                <p className="font-bold text-xl text-purple-300 text-center pb-5">Priya & Rohit Mehta, Mumbai</p>
                            </div>
                            <p>“Our family outings
                                are easier to manage
                                now. Splitting expe
                                nses is transparent,
                                and everyone stays
                                updated. Finverse
                                has made financial
                                planning smooth and
                                stress-free!”
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Landing