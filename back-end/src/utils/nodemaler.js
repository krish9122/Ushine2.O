import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const mailSender = async (clientGmail, generatedOtp) => {
    return transport.sendMail({
        from: process.env.GMAIL,
        to: clientGmail,
        subject: "Your Ushine OTP",
        text: `Your OTP is: ${generatedOtp}. It expires in 5 minutes.`,
    });
};

export default mailSender;
