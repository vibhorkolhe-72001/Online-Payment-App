import axios from "axios";
import { useEffect, useRef, useState } from "react";
import logo from "./Money Transfer.gif";
import logo_1 from "./1.gif";
import successSound from "./successed-295058.mp3";
import pay_faileds from "./Error animation.gif";
import failureSound from "./Voicy_Apple pay fail.mp3";
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const [contact_search, set_contact_search] = useState("");
    const [search_store_details, set_search_store_details] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [amount, set_amount] = useState("");
    const [show_balance, set_show_balance] = useState(0);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [isPaying, setIsPaying] = useState(false);
    const [pay_process, set_pay_process] = useState(false);
    const [pay_done, set_pay_done] = useState(false);
    const [pay_failed, set_pay_failed] = useState(false);

    const [paymentError, setPaymentError] = useState("");

    const navigate = useNavigate();

    const audioRef = useRef(null);

    useEffect(() => {
        if (pay_done && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [pay_done]);

    const failAudioRef = useRef(null);

    useEffect(() => {
        if (pay_failed && failAudioRef.current) {
            failAudioRef.current.currentTime = 0;
            failAudioRef.current.play();
        }
    }, [pay_failed]);




    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // or "/login"
        }
    }, []);

    const search_contact = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("http://localhost:3000/search_user",
                { mobile: contact_search },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            if (response.data.user) {
                set_search_store_details(response.data.user);
            }
        } catch (err) {
            if (err.response) {
                alert(err.response.data.err);
            } else {
                alert("Error: " + err.message);
            }
            set_search_store_details("");
        }
    };

    const openpopup = () => {
        setShowModal(true);
    };

    const handleconfirmpay = async () => {
        if (!amount || amount <= 0) {
            return alert("Please enter a valid amount");
        }

        set_pay_process(true);
        setIsPaying(true);

        setTimeout(async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.post("http://localhost:3000/send_money", {
                    ToPhone: search_store_details.Phone_no,
                    Amount: parseFloat(amount),
                }, {
                    headers: { Authorization: token }
                });




                if (response.data.success) {
                    set_pay_process(false);
                    set_pay_done(true);

                    fetchBalance();
                    trans_his();

                    set_amount("");


                    setTimeout(() => {
                        set_pay_done(false);
                        setShowModal(false);
                    }, 2500);
                } else {
                    throw new Error(response.data);
                }
            } catch (err) {
                console.log(err);
                setPaymentError(err.message || "Payment Failed");


                set_pay_failed(true);
                setShowModal(true);

                setTimeout(() => {
                    set_pay_failed(false);
                    setShowModal(false);
                }, 2500);

                // alert("Insufficient Balance");
                set_amount("");
                trans_his();
            } finally {
                setIsPaying(false);
                if (!pay_done) {
                    set_pay_process(false);
                }
            }
        }, 3000);
    };


    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/balance", {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (response.data) {
                set_show_balance(response.data.Balance);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const trans_his = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/tran_his",
                {},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            setTransactionHistory(response.data.tran_his);
        } catch (err) {
            console.log("Transaction history error:", err);
        }
    };

    useEffect(() => {
        fetchBalance();
        trans_his();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
                <div>
                    <p className="text-sm capitalize font-bold">Total Balance</p>
                    <h1 className="text-2xl font-bold">Rs {show_balance}</h1>
                </div>
                <button onClick={handleLogout} className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium shadow hover:bg-gray-100">
                    Logout
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <input
                        id="phone"
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="Enter Phone Number"
                        className="w-full px-4 py-2 border rounded-md mb-4"
                        value={contact_search}
                        onChange={(e) => set_contact_search(e.target.value)}
                    />
                    <button
                        type="button"
                        className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
                        onClick={search_contact}
                    >
                        Search
                    </button>
                    <div className="mt-4">
                        {search_store_details ? (
                            <div className="p-4 border rounded-md bg-gray-50 space-y-2">
                                <p><strong>Name:</strong> {search_store_details.Firstname} {search_store_details.Lastname}</p>
                                <p><strong>Email:</strong> {search_store_details.Email}</p>
                                <p><strong>Phone:</strong> {search_store_details.Phone_no}</p>
                                <button
                                    disabled={isPaying}
                                    onClick={openpopup}
                                    className="w-full bg-green-500 text-white py-2 rounded-md mt-2 hover:bg-green-600"
                                >
                                    Pay
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center mt-6">No user data. Search to see results.</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-md h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">Recent Transactions</h2>
                        <a href="#" className="text-sm text-blue-500">View All</a>
                    </div>
                    <ul className="space-y-3 overflow-y-auto max-h-[500px]">
                        {transactionHistory.length > 0 ? (
                            transactionHistory.map((tran, i) => (
                                <li key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm">
                                    <div>
                                        <p className="font-medium">From: {tran.From}</p>
                                        <p className="text-xs text-gray-500">To: {tran.To}</p>
                                        <p className="text-xs text-gray-500">Date: {new Date(tran.TransactionDate).toLocaleString()}</p>
                                        <p className={`text-xs font-semibold ${tran.Status === "Completed"
                                            ? "text-green-600"
                                            : tran.Status === "Pending"
                                                ? "text-yellow-500"
                                                : "text-red-500"
                                            }`}>Status: {tran.Status}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-red-500">
                                        {`-₹${tran.Amount}`}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No transactions found.</p>
                        )}
                    </ul>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Enter Payment Amount</h2>
                        <input
                            type="number"
                            className="w-full border rounded-md p-2 mb-3"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => set_amount(e.target.value)}
                        />

                        {pay_process && !pay_done && !pay_failed && (
                            <div className="absolute top-0 left-0 h-screen w-full bg-white flex justify-center items-center flex-col">
                                <img src={logo} className="size-[200px] object-contain" alt="Processing" />
                                <h1 className="font-semibold">Processing Transaction...</h1>
                            </div>
                        )}

                        {pay_done && !pay_failed && (
                            <div className="absolute top-0 left-0 h-screen w-full bg-white flex justify-center items-center">
                                <img src={logo_1} className="size-[200px] object-contain" alt="Payment Success" />
                            </div>
                        )}

                        {pay_failed && !pay_done && (
                            <div className="absolute top-0 left-0 h-screen w-full bg-white flex justify-center items-center flex-col">
                                <img src={pay_faileds} className="size-[200px] object-contain" alt="Payment Failed" />
                                <p className="text-red-500 mt-4 font-semibold">{paymentError}</p>
                            </div>
                        )}



                        <audio ref={audioRef} src={successSound} />
                        <audio ref={failAudioRef} src={failureSound} />


                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    set_pay_process(false);
                                    set_pay_done(false);
                                    set_pay_failed(false);
                                }}

                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleconfirmpay}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Confirm Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;