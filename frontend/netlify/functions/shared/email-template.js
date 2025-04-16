export function getEmailTemplate() {
    return `
        <!doctype html>
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Simple Transactional Email</title>
            <style media="all" type="text/css">
        @media only screen and (max-width: 640px) {
        .main p,
        .main td,
        .main span {
            font-size: 16px !important;
        }

        .wrapper {
            padding: 8px !important;
        }

        .content {
            padding: 0 !important;
        }

        .container {
            padding: 0 !important;
            padding-top: 0 !important;
            width: 100% !important;
        }

        .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important;
        }

        .btn table {
            max-width: 100% !important;
            width: 100% !important;
        }

        .btn a {
            font-size: 16px !important;
            max-width: 100% !important;
            width: 100% !important;
        }
        }
        @media all {
        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
        }
        }
        </style>
        </head>

        <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #9f88ee; margin: 0; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9f88ee; width: 100%;" width="100%" bgcolor="#9f88ee">
                <tr>
                    <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px; width: 600px; margin: 0 auto;" width="600" valign="top">
                        <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">

                            <!-- START CENTERED WHITE CONTAINER -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 5px; width: 100%;" width="100%">

                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                    <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px; text-align: center;" valign="top" align="center">
                                        <h1 style="margin: 0; color: #6D55C8;">#WHYNOTYOU</h1>
                                        <h2 style="margin-top: 0; color: #FFC13D;">YOUR PHOTO</h2>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                            <tr>
                                                <td align="center" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">
                                                    <img src="cid:photobooth.jpg" alt="Your photo" style="width: 90%; max-width: 400px; height: auto; margin: 48px 0; box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.3);">
                                                </td>
                                            </tr>
                                        </table>
                                        <h2 style="color: #6D55C8;">You've got what it takes to lead.</h2>
                                        <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Let's bring more women to the sidelines.</p>
                                        <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Take the first step toward your FA-accredited
                                            <br>C Licence Coaching Certification.
                                        </p>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; margin: 24px 0; min-width: 100%;" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td align="center" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top">
                                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; border-radius: 40px; text-align: center; background-color: #FFC13D;" valign="top" align="center" bgcolor="#FFC13D"> <a href="http://htmlemail.io" target="_blank" style="border: solid 2px #FFC13D; border-radius: 40px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #FFC13D; border-color: #FFC13D; color: #000000;">Start
                                                                            your journey →</a> </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">⚽ Next intake: <strong>30.04.2025</strong></p>
                                        <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">🏆 Limited to <strong>30 participants</strong></p>
                                    </td>
                                </tr>

                                <!-- END MAIN CONTENT AREA -->
                            </table>

                            <!-- START FOOTER -->
                            <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                    <tr>
                                        <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; color: #fff; font-size: 16px; text-align: center;" valign="top" align="center">
                                            <p style="font-family: Helvetica, sans-serif; font-weight: normal; margin: 0; margin-bottom: 16px; color: #fff; font-size: 16px; text-align: center;">Don't like these emails? <a href="http://htmlemail.io/blog" style="text-decoration: underline; color: #fff; font-size: 16px; text-align: center;">Unsubscribe</a>.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                    </tr>
                                </table>
                            </div>

                            <!-- END FOOTER -->

                            <!-- END CENTERED WHITE CONTAINER -->
                        </div>
                    </td>
                </tr>
            </table>
        </body>

        </html>`;
}
