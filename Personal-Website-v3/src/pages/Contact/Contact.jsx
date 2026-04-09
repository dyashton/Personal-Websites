import Github from "../../assets/Github.png"
import Instagram from "../../assets/instagram.png"
import LinkedIn from "../../assets/LinkedIn.png"
import { useState, useEffect } from "react"
import emailjs from "emailjs-com"

export default function Contact() {
    
    const [FormData, setFormData] = useState(
        {
            name: "",
            email: "",
            phone: "",
            company: "",
            message: ""
        }
    );
    
    function handleSubmit(e){
        e.preventDefault();
        console.log("Form Data: ", FormData)
        emailjs.sendForm(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, e.target, import.meta.env.VITE_PUBLIC_KEY).then(
            (error) => {
                console.log(error.text);
                alert("Failed to send message. Please try again.");
            }
            );
    }

    useEffect(() => {
        console.log("FormData changed: ", FormData);
        if(FormData.name === "" && FormData.phone === "" && FormData.email === "" && FormData.company === "" && FormData.message === ""){
            return;
        }
        localStorage.setItem("FormData", JSON.stringify(FormData));
    },[FormData]);

    useEffect(() => {
        const storedData = localStorage.getItem("FormData");
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);
    
    return (
        <div className="Page min-h-0 overflow-y-auto">
            <div className="w-full min-h-full flex flex-col lg:flex-row gap-10 lg:gap-6 px-4 py-8 md:px-8">
                <div className="w-full lg:w-3/4 flex flex-col items-center justify-start">
                <h1 className="text-3xl md:text-4xl text-neutral-200 mt-8 md:mt-24">Contact Me</h1>
                <form 
                onSubmit={handleSubmit}
                className="w-full max-w-2xl flex flex-col items-center justify-start gap-4 mt-8 md:mt-16 px-1">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full">
                        <input required 
                        name="name"
                        type="text" 
                        placeholder="Name" 
                        value={FormData.name}
                        onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                        <input required 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        value={FormData.email}
                        onChange={(e) => setFormData({ ...FormData, email: e.target.value })}                     
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full">
                        <input required 
                        name="phone"
                        type="text" 
                        placeholder="(123) 456-7890" 
                        value={FormData.phone}
                        onChange={(e) => setFormData({ ...FormData, phone: e.target.value })}
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                        <input required 
                        name="company"
                        type="text" 
                        placeholder="Company" 
                        value={FormData.company}
                        onChange={(e) => setFormData({ ...FormData, company: e.target.value })}
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                    </div>
                    <textarea 
                    required 
                    name="message" 
                    placeholder="Message" 
                    value={FormData.message}
                    onChange={(e) => setFormData({ ...FormData, message: e.target.value })}
                    className="outline-none w-full focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 min-h-[8rem] text-start flex justify-start"/>
                    <div className="w-full text-end mt-6">
                        <button type="submit" className="bg-neutral-600 p-3 rounded-sm cursor-pointer hover:bg-neutral-500">Send</button>
                    </div>
                </form>

                </div>
                <div className="w-full lg:w-1/4 flex flex-row lg:flex-col flex-wrap items-center lg:items-center justify-center gap-6 lg:gap-8 pb-8 lg:pb-0 border-t border-neutral-800 lg:border-t-0 pt-8 lg:pt-0">
                    <h2 className="w-full text-center lg:text-left text-2xl mb-0 lg:mb-4">Find Me</h2>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/_ashtondy/" className="w-full max-w-xs flex flex-row justify-center sm:justify-start gap-4 items-center">
                        <img src={Instagram} className="w-12 h-12 shrink-0" alt="Instagram"/>
                        <span className="text-neutral-200">_dyashton</span>
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/ashton-dy/" className="w-full max-w-xs flex flex-row justify-center sm:justify-start gap-4 items-center">
                        <img src={LinkedIn} className="w-12 h-12 shrink-0" alt="LinkedIn"/>
                        <span className="text-neutral-200">Ashton Dy</span>
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://github.com/dyashton" className="w-full max-w-xs flex flex-row justify-center sm:justify-start gap-4 items-center">
                        <img src={Github} className="w-12 h-12 shrink-0" alt="GitHub"/>
                        <span className="text-neutral-200">dyashton</span>
                    </a>
                </div>
            </div>
        </div>                
    )
}
