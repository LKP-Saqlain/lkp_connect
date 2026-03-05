import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

const TermsAndConditions = ({
  handleChechbox,
  handleOtpPage,
  clientDetails = null,
}: {
  handleChechbox: (value: boolean) => void;
  handleOtpPage: () => void;
  clientDetails?: any;
}) => {
  const [tncAccepted, setTncAccepted] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // const handleConsentClick = () => {
  //   handleChechbox(tncAccepted);
  // };
  const handleConsentClick = (value: boolean) => {
    console.log("value1113423423", value);
    handleChechbox(value);
  };
  return (
    <>
      {/* Client Info Section */}
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          color: "#000",
          mb: 1.5,
        }}
      >
        Buy stock for delivery with lesser margins using the Margin Trading
        facility.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {/* Client Name */}
        <Box
          sx={{
            flex: "1 1 22%",
            border: "1px solid #E2E2E2",
            borderRadius: "8px",
            backgroundColor: "#F7F7F7",
            padding: "10px 14px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "900",
              color: "#01396B",
            }}
          >
            Client Name
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 900, mt: 0.5 }}>
            {clientDetails?.cn}
          </Typography>
        </Box>

        {/* Client Code */}
        <Box
          sx={{
            flex: "1 1 22%",
            border: "1px solid #E2E2E2",
            borderRadius: "8px",
            backgroundColor: "#F7F7F7",
            padding: "10px 14px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#01396B",
            }}
          >
            Client Code
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 900, mt: 0.5 }}>
            {clientDetails?.cc}
          </Typography>
        </Box>

        {/* Mobile No */}
        <Box
          sx={{
            flex: "1 1 22%",
            border: "1px solid #E2E2E2",
            borderRadius: "8px",
            backgroundColor: "#F7F7F7",
            padding: "10px 14px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#01396B",
            }}
          >
            Mobile No
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 900, mt: 0.5 }}>
            {clientDetails?.mob}
          </Typography>
        </Box>

        {/* Email */}
        <Box
          sx={{
            flex: "1 1 30%",
            border: "1px solid #E2E2E2",
            borderRadius: "8px",
            backgroundColor: "#F7F7F7",
            padding: "10px 14px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#01396B",
            }}
          >
            Email ID
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 900, mt: 0.5 }}>
            {clientDetails?.mail}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ position: "relative" }}>
        {/* Floating Label */}
        <Typography
          sx={{
            position: "absolute",
            top: "-10px",
            left: "30px",
            backgroundColor: "#FFFFFF",
            px: "6px",
            fontSize: "13px",
            fontWeight: 900,
            color: "#01396B",
          }}
        >
          Terms & Conditions
        </Typography>

        {/* Scrollable Content Box */}
        <Box
          onScroll={(e) => {
            const target = e.currentTarget;
            const isBottom =
              target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

            if (isBottom) {
              setIsScrolledToBottom(true);
            }
          }}
          sx={{
            border: "1px solid #D9D9D9",
            borderRadius: "12px",
            p: "1.3rem 1.2rem",
            backgroundColor: "#FFFFFF",
            overflowY: "auto",
            fontSize: "12px",
            lineHeight: 1.6,
            color: "#000000",
            minHeight: "180px",
            maxHeight: "350px",
          }}
        >
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li>
              I confirm that I have received, read, and understood the
              SEBI-prescribed Rights and Obligations for Margin Trading Facility
              and the Member’s Terms & Conditions for MTF. I agree to be bound
              by the same and to refer to updated policies and procedures as
              posted on the Member’s website from time to time.
            </li>
            <li>
              I agree to receive all MTF-related communications, including
              confirmation of orders/trades, margin calls, and liquidation
              notices, on my registered email address and/or mobile number, sent
              electronically by LKP Securities Ltd. Securities Limited.
            </li>
            <li>
              I/we understand that by availing the Margin Trading Facility
              (MTF), I/we authorize LKP Securities Ltd.to treat trades in
              ‘Eligible Securities’ (as notified by SEBI/Exchanges from time to
              time) (Group I securities with LKP Securities Ltd. approved
              securities) which are not fully funded by 100% margin (cash and/or
              approved securities) as trades executed under MTF.
            </li>
            <li>
              I/we understand and acknowledge that LKP Securities Ltd. May
              consider the entire clear credit balance in my normal trading
              account ledger for adjustment against margin requirements in my
              MTF account. Interest shall be levied on the net debit balance in
              the MTF account on a daily basis, in accordance with the agreed
              rate schedule.
            </li>
            <li>
              I acknowledge that my MTF account will be maintained separately
              from my normal trading account under my unique client code (UCC)
              and that all MTF transactions will be reported distinctly to the
              Exchanges.
            </li>
            <li>
              I/we understand and agree that the interest on funding availed
              under MTF shall be calculated on a daily basis at the rate
              mutually agreed (currently 20.75 % p.a.), and such rate may be
              revised by the Member from time to time with prior intimation to
              me/us through email/SMS/portal notification.
            </li>
            <li>
              I understand and accept that the Member may, without further
              notice, liquidate my collateral or positions in the event of a
              margin shortfall or under any other circumstances permitted by
              SEBI/Exchange rules and the Member’s policy.
            </li>
            <li>
              I have understood the risks associated with availing MTF,
              including market volatility, interest liability, and possible
              liquidation of securities, and confirm that I have the financial
              capacity to bear such risks.
            </li>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              RIGHTS & OBLIGATIONS OF STOCK BROKERS & CLIENTS FOR MARGIN TRADING
              FUNDING (MTF)
              <br />
              Part A: Rights and Obligations Mandatory Clauses of BSE
            </li>

            <ol style={{ margin: 0, paddingLeft: "18px" }}>
              <li>
                Stock Broker/ Trading Member is eligible to provide Margin
                Trading Funding (MTF) in accordance with SEBI & Exchange
                Guidelines as specified from time to time.
              </li>
              <li>
                Stock Broker/Trading Member desirousof extending MTF to
                theirclients is requiredto obtain priorpermission of BSE. Stock
                Broker/ Trading Member may note that BSE has the right to
                withdraw the permission at any time.
              </li>
              <li>
                Stock Broker/Trading Member shall extend the MTF to the
                client,on such terms and conditions as specified by the Stock
                Exchange / SEBI from time to time. Stock Broker/ Trading.
              </li>
              <li>
                Stock Broker/ Trading Member shall intimate all the terms and
                conditions, including maximum allowable exposure,    specific
                stock exposures etc., as well as the rights and obligations to
                the client desirous of availing MTF.
              </li>
              <li>
                Stock Broker/ Trading Member may, at its sole and absolute
                discretion, increase the limit of initial and/or maintenance
                margin, from time to time. The Client shall abide by such
                revision, and where there is an upward revision of such margin
                amount, he agrees to make up the shortfall within such time as
                the Stock Broker/ Trading Member may permit. It may however, be
                noted that the initial/ maintenance margins shall never be lower
                than that prescribed by Stock Exchange/ SEBI.
              </li>
              <li>
                Stock Broker/ Trading Member shall provide MTF only in respect
                of such shares, as may be permitted by Stock Exchange/ SEBI.
              </li>
              <li>
                Stock Broker/ Trading Member shall liquidate the securities and
                other collateral, if the client fails to meet the margin call to
                comply with the margin requirement as specified by Stock
                Exchange/ SEBI/ Stock Broker/ Trading Member. In this regard,
                Stock Broker/ Trading Member shall also list down situations/
                conditions in which the securities may be liquidated (Stock
                Broker/ Trading Member to list down situations/ conditions which
                are included in the subsequent part of the T&C below).
              </li>
              <li>
                Stock Broker/ Trading Member shall not use the funds of one
                client to provide MTF to another client, even if the same is
                authorized by the first client.
              </li>
              <li>
                The stocks deposited as collateral with the Stock Broker/
                Trading Member for availing margin trading Funding (Collaterals)
                and the stocks purchased under the margin trading Funding
                (Funded stocks) shall be identifiable separately and no
                comingling shall be permitted for the purpose of computing
                funding amount.
              </li>
              <li>
                IPF shall not be available for transactions done on the Stock
                Exchange, through MTF, in case of any losses suffered in
                connection with the MTF availed by the client.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              The rights and obligations prescribed hereinabove shall be read in
              conjunction with the rights and obligations as prescribed under
              SEBI circular no. CIR/ MIRSD/ 16/ 2011 dated August 22, 2011
              <br />
              Part B: Rights and Obligations Mandatory Clauses of BSE
            </li>
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              CLIENT RIGHTS
            </li>
            <ol style={{ margin: 0, paddingLeft: "18px" }}>
              <li>
                Client shall receive all communications in a mode mutually
                agreed between the broker and the client regarding confirmation
                of orders/trades, margin calls, decision to liquidate the
                position /security.
              </li>
              <li>
                Client shall be free to take the delivery of the securities at
                any time by repaying the amounts that was paid by the Stock
                Broker to the Exchange towards securities after paying all dues.
              </li>
              <li>
                Client has a right to change the securities collateral offered
                for Margin Trading Funding at any time so long as the securities
                so offered are approved for margin trading Funding.
              </li>
              <li>
                Client may close / terminate the Margin Trading Account at any
                time after paying the dues.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              CLIENT OBLIGATIONS
            </li>
            <ol style={{ margin: 0, paddingLeft: "18px" }}>
              <li>
                Client shall, in writing in his own hand or in any irrefutable
                electronic method, agree to avail of Margin Trading Funding in
                accordance with the terms and conditions of Margin Trading
                Funding offered by the broker, method of communication for
                confirmation of orders/trades, margin calls and calls for
                liquidation of collateral/security/position.
              </li>
              <li>
                Client shall inform the broker of its intent to shift the
                identified transaction under Margin Trading Fundingwithin the
                time lines specified by the broker failing which the transaction
                will be treated under the normal trading Funding.
              </li>
              <li>
                Client shall place the margin amounts as the Stock Broker may
                specify to the client from time to time.
              </li>
              <li>
                On receipt of 'margin call', the client shall make good such
                deficiency in the amount of margin placed with the Stock Broker
                within such time as the Stock Broker may specify.
              </li>
              <li>
                By agreeing to avail Margin Trading Funding with the broker,
                client is deemed to have authorized the broker to retain and/or
                pledge the securities provided as collateral or purchased under
                the Margin Trading Funding till the amount due in respect of the
                said transaction including the dues to the broker is paid in
                full by the client.
              </li>
              <li>
                Client shall lodge protestor disagreement with any transaction
                done under the margin tradingFunding within the timelines as may
                be agreed between the client and broker.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              STOCK BROKER RIGHTS
            </li>
            <ol style={{ margin: 0, paddingLeft: "18px" }}>
              <li>
                Stock Broker and client may agree between themselves the terms
                and condition including commercial terms if any before
                commencement of MTF.
              </li>
              <li>
                Stock broker may set up its own risk management policy that will
                be applicable to the transactions done under the Margin Trading
                Funding. Stock broker may make amendments there to at any time
                but give effect to such policy after the amendments are duly
                communicated to the clients registered under the Margin Trading
                Facility.
              </li>
              <li>
                The broker has a right to retain and/or pledge the securities
                provided as collateral or the securities bought by the client
                under the Margin Trading Facility.
              </li>
              <li>
                The broker may liquidate the securities if the client fails to
                meet the margin call made by the broker as mutually agreed of
                liquidation terms but not exceeding 5 working days from the day
                of margin call.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              STOCK BROKER OBLIGATIONS
            </li>
            <ol style={{ margin: 0, paddingLeft: "18px" }}>
              <li>
                Stock broker shall agree with the client the terms and condition
                before extending Margin Trading Funding to such client. However,
                for clients who already have existing trading relationship and
                want to avail of Margin Trading Funding, stock broker may take
                consent in writing in his own hand or in any irrefutable
                electronic method after stock broker has communicated the terms
                and conditions of Margin Trading Funding to such existing
                clients.
              </li>
              <li>
                The terms and conditions of Margin Trading Funding shall be
                identified separately, in a distinct section if given as a part
                of account opening agreement.
              </li>
              <li>
                The mode of communication of order confirmation, margin calls or
                liquidation of position/security shall be as agreed between the
                broker and the client and shall be in writing in his own hand or
                in any irrefutable electronic method. Stock broker shall
                prescribe and communicate its margin policies on haircuts/ VAR
                margins subject to minimum requirements specified by SEBI and
                exchanges from time to time.
              </li>
              <li>
                The Stock Broker shall monitor and review on a continuous basis
                the client’s positions with regard to MTF.
              </li>
              <li>
                Any transaction to be considered for exposure to MTF shall be
                determined as per the policy of the broker provided that such
                determination shall happen not later than T + 1 day.
              </li>
              <li>
                If the transaction is entered under margin trading account,
                there will not be any further confirmation that it is margin
                trading transaction other than contract note.
              </li>
              <li>
                In case the determination happens after the issuance of
                contract, the broker shall issue appropriate records to
                communicate to Client the change in status of transaction from
                Normal to Margin trading and should include information like the
                original contract number and the margin statement and the
                changed data.
              </li>
              <li>
                The Stock Broker shall make a “margin call” requiring the client
                to place such margin; any such call shall clearly indicate the
                additional/deficient margin to be made good.
              </li>
              <li>
                Time period for liquidation of position/security shall be in
                accordance declared policy of the broker as applicable to all
                MTF clients consistently. However, the same should not be later
                than working (trading) days from the day of “margin call”. If
                securities are liquidated, the contract note issued for such
                margin call related transactions shall carry an asterisk or
                identifier that the transaction has arisen out of margin call.
              </li>
              <li>
                The daily margin statements sent by broker to the client shall
                identify the margin/collateral for Margin Trading separately.
              </li>
              <li>
                Margin Trading Accounts where there was no transactions for 90
                days shall be settled immediately.
              </li>
              <li>
                The stocks deposited as collateral with the stock broker for
                availing margin trading Funding (Collaterals) and the stocks
                purchased under the margin trading Funding (Funded stocks) shall
                be identifiable separately and there shall not be any comingling
                for the purpose of computing funding amount.
              </li>
              <li>
                Stock Broker shall close/terminate the account of the client
                forthwith upon receipt of such request from the client subject
                to the condition that the client has paid dues under Margin
                Trading Facility.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              Part C: Terms and Conditions of LKP SECURITIES LTD. Securities
              Ltd. for trading in Margin Trading Funding Definitions:
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                The terms and conditions prescribed hereunder form part of
                account opening form, shall be read in conjunction with the
                rights and obligation as prescribed under SEBI circular no.
                CIR/MIRSD/16/2011 dated August 22, 2011 and the Rules,
                Regulations, Bye Laws, Rights and Obligation, Guidelines,
                Circulars issued by SEBI and Exchanges from time to time.
              </li>
              <li>
                In these terms and conditions, unless indicated otherwise,
                specific words and phrases have the meaning as stated hereunder
                (arranged alphabetically for ease of reading) and the client
                confirms having read and understood these words and phrases.
              </li>
              <li>
                “Alerts” means a customized SMS or Email Communication sent to
                clients on their registered Email Address or Mobile Number.
              </li>
              <li>
                “Additional Margin” shall mean the incremental margin required
                to safeguard Margin Trading positions from being squared off.
              </li>
              <li>
                “Client” means a constituent of LKP SECURITIES LTD. who have in
                his own hand or in any irrefutably electronic mode, agreed to
                have availed the Funding of Margin Trading and executed Power of
                Attorney in favour of LKP SECURITIES LTD. and has an existing
                and valid Account with LKP SECURITIES LTD.. Client shall include
                Individual, Company, Partnership firm, Trust, Hindu Undivided
                Family, Association of Person and Body of Individuals etc.
              </li>
              <li>
                “Communication in electronic mode” means alerts send to clients
                registered Email Address or Mobile Number.
              </li>
              <li>
                “LKP Securities Ltd.” means Stock Broker of National Stock
                Exchange of India Limited (TM Code: 07200) and BSE Limited (Clg
                No: 408) having obtained prior permission from respective
                exchange to provide Margin Trading Funding to its clients.
              </li>
              <li>
                “Margin Trading Funding” is the product being offered by LKP
                Securities Ltd. to Clients under the framework of rules,
                regulations issued by Exchanges/ SEBI from time to time.
              </li>
              <li>“SMS” means “Short Messaging Service”</li>
              <li>
                “Securities” means all funded and collateral stocks that are
                permissible set of securities as provided by NSE and BSE from
                time to time under the margin trading Funding.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              SECURITIES ELIGIBLE FOR MARGIN TRADING:
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                Equity Shares that are classified as 'Group I security' as per
                SEBI Master circular No. SEBI/HO/MRD/DP/CIR/P/2016/135 dated
                December 16, 2016, shall be eligible for margin trading Funding
                and as amended from time and time .LKP SECURITIES LTD. reserves
                the right to offer or not offer MTF on such list of securities
                as specified from time to time.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              MARGIN TRADING FUNDING:
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                LKP SECURITIES LTD. at all times shall have the liberty to
                exercise its right in its sole discretion to determine the
                extent to which the MTF be made available to the Client.
              </li>
              <li>
                LKP SECURITIES LTD. shall not be bound to grant MTF to the
                Client (which decision shall be at the sole and exclusive
                discretion of LKP SECURITIES LTD.) and LKP SECURITIES LTD. shall
                not be required to provide any reasons thereof nor shall LKP
                SECURITIES LTD. be liable for any damages (whether direct or
                consequential or whether financial or nonfinancial) to the
                Client by reason of LKP SECURITIES LTD. refusal to grant MTF to
                the Client.
              </li>
              <li>
                LKP SECURITIES LTD. will extend margin trading Funding on
                eligible list of securities to client for T+90 days or for
                further period on fulfillment of conditions specified by LKP
                SECURITIES LTD. as per its risk management policy.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              MARGIN REQUIREMENT:
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                In order to avail margin trading facility, initial margin
                required shall be asunder:
              </li>

              <Paper
                sx={{
                  width: "100%",
                  mb: 2,
                  border: "1px solid #ccc",
                  boxShadow: "none",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Category of Stock
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Applicable margin
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        Group I stocks available for trading in the F &amp; O
                        Segment
                      </TableCell>
                      <TableCell>
                        Maximum of (VaR + 3 times of applicable ELM*, approved
                        haircut)
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        Group I stocks other than F&amp;O stocks
                      </TableCell>
                      <TableCell>
                        Maximum of (VaR + 5 times of applicable ELM*, approved
                        haircut)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
              <li>
                The client shall ensure maintenance of the aforesaid margin at
                all times during the period that the margin trading Funding is
                being availed by the client. The client shall ensure to place
                the aforesaid margin in the form and manner as may be specified
                by LKP SECURITIES LTD. from time to time.
              </li>
              <li>
                LKP SECURITIES LTD. may, at its sole and absolute discretion,
                increase the limit of initial and/or maintenance margin, from
                time to time. The Client shall abide by such revision, and where
                there is an upward revision of such margin amount, agree to make
                up the revised margin immediately, not later than 5 working days
                from the day of margin call, failing which LKP SECURITIES LTD.
                may exercise its discretion / right to liquidate the security/
                collateral and/or close out the position immediately. It may
                however, be noted that the initial/ maintenance margins
                will/shall never be lower than that prescribed by Stock
                Exchange/ SEBI.
              </li>
              <li>
                In case of short fall in margins, LKP SECURITIES LTD. will make
                necessary margin calls. On receipt of ‘margin call’, the client
                shall make good such deficient margin / margin call by placing
                the further margin immediately, failing which LKP SECURITIES
                LTD. may exercise its discretion / right to liquidate the
                security / collateral and / or close out the position
                immediately depending upon the market conditions and /or the
                volatility
              </li>
              <li>
                The Client agrees that the Mark to Market (MTM) process run by
                LKP SECURITIES LTD. to call for additional margin on Client
                positions shall be considered as online margin call given to the
                client. Further, the client has been provided with reports on
                the trader terminal (TT) itself where he can ascertain details
                of his existing margin blocked, margins required, MTM loss
                adjustment, margin shortfall, margin percentage etc. The margin
                requirement derived by use of these reports and the MTM process
                run by LKP SECURITIES LTD. to call for additional margin on open
                positions will be construed as margin call/ demand for the
                additional margin required by LKP SECURITIES LTD.. Clients are
                bound to monitor and review their open positions and margin
                requirements all the times and furnish the additional margin to
                the Company. LKP SECURITIES LTD. reserves the right to close out
                the open position at any time in case the Client does not
                satisfy the additional Margin requirements. The Client shall
                maintain sufficient margin at all the time to provide for limit
                and avoid liquidation.
              </li>
              <li>
                LKP SECURITIES LTD. will set up separate risk management policy
                as amended from time to time, that will be applicable to the
                transactions done under the Margin Trading Funding.
              </li>
              <li>
                LKP SECURITIES LTD. will clearly indicate on its trader terminal
                (TT) the additional/ deficient margin to be made good while
                making “margin call” to the client.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              COLLATERALS:
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                The initial margin payable by the client to LKP SECURITIES LTD.
                shall be in the form of cash, cash equivalent or Group I equity
                shares, with appropriate hair cut as specified in SEBI Master
                circular no. SEBI/HO/MRD/DP/CIR/P/2016/135 dated December 16,
                2016.
              </li>
              <li>
                By agreeing to avail Margin Trading Funding with LKP SECURITIES
                LTD., client is deemed to have authorized LKP SECURITIES LTD. to
                retain and/or pledge the securities provided as collateral or
                purchased under the Margin Trading Funding and any corporate
                benefit thereon, if any, till the amount due in respect of the
                said transaction including the dues to LKP SECURITIES LTD. is
                paid in full by the client.
              </li>
              <li>
                Client have a right to change the securities collateral offered
                for Margin Trading Funding at any time with prior notice in
                writing to LKP SECURITIES LTD. so long as the securities so
                offered are approved for margin trading Funding.
              </li>
              <li>
                The Stock deposited as collateral with LKP SECURITIES LTD. for
                availing MTF (Collaterals) and the stocks purchased under the
                MTF (Funded Stock) shall be identifiable separately and there
                shall not be any commingling for the purpose of computing
                funding amount.
              </li>
              <li>
                LKP SECURITIES LTD. will hold and / or will appropriate the
                credit lying in the Client account and/or any unutilized/
                unpledged shares/ securities lying in demat account along with
                all other demat accounts / Mutual Funds / IPO account of the
                Client towards the repayment of the outstanding dues thereof
                under MTF.
              </li>
              <li>
                LKP SECURITIES LTD. is at its discretion to identify the
                eligible/excess securities available with the client and mark
                such securities as collateral towards MTF.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {/* Part A Heading */}
            <li
              style={{
                listStyleType: "none",
                margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              EXPOSURE & MAXIMUM PERMISSIBLE EXPOSURE:
            </li>
            <li
              style={{
                listStyleType: "none",
                // margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              Client Wise :
            </li>
            <ul style={{ paddingLeft: "18px" }}>
              <li>
                Maximum Exposure to any single client at any point of time will
                not exceed 10% of the borrowed funds by LKP SECURITIES LTD. and
                50% of LKP SECURITIES LTD.’s “net worth”
              </li>
            </ul>
            <li
              style={{
                listStyleType: "none",
                // margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              Securities Wise :
            </li>
            <ul style={{ paddingLeft: "18px" }}>
              <li>
                Exposure towards stocks purchased under margin trading Funding
                and collateral kept in the form of securities will be as per the
                appropriate Board approved policy in this regard from time to
                time.
              </li>
            </ul>
            <li
              style={{
                listStyleType: "none",
                // margin: "10px 0px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              Exposure on the increased value of Collaterals :
            </li>
            <ul style={{ paddingLeft: "18px" }}>
              <li>
                In case of increase in the value of Collaterals, LKP SECURITIES
                LTD. may at its sole discretion have the option of granting
                further exposure to the client s object to applicable haircuts.
                However, no such exposure shall be permitted on the increased
                value of funded stocks.
              </li>
            </ul>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              MARGIN TRADING FACILITIES TRADES
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                By providing the consent for availing margin trading Funding,
                client authorize LKP SECURITIES LTD. Securities Ltd.to consider
                all his/her/its trades placed by them in Group I securities to
                be treated as trades availed by them under the margin trading
                Funding and accordingly report such trades to Exchanges subject
                to availability of margin in form and manner as communicated by
                LKP SECURITIES LTD. from time to time.
              </li>
              <li>
                If the transaction is entered under margin trading account,
                there will not be any further confirmation that it is margin
                trading transaction other than contract note.
              </li>
              <li>
                Client will be free to take the delivery of the securities at
                any time by repaying the amounts that was paid by LKP SECURITIES
                LTD. to the Exchange towards the securities bought under margin
                trading Funding after paying all dues.
              </li>
              <li>
                LKP SECURITIES LTD. shall monitor and review on a continuous
                basis the client’s position with regards to MTF.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              INTEREST CALCULATION AND REPORTING OF TRADES
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                LKP SECURITIES LTD. would consider entire clear credit ledger
                balance in the clients normal ledger for adjustment against the
                margin trading Funding trades (Ledger) and only the net debit
                balance would be considered as funded amount for reporting
                purpose.
              </li>
              <li>
                LKP SECURITIES LTD. would calculate and levy the interest on the
                net debit balance in the MTF Ledger.
              </li>
              <li>
                The interest charge would be calculated on a daily basis at the
                rate specified and published by LKP SECURITIES LTD. from time to
                time.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              MODE OF COMMUNICATION
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                LKP SECURITIES LTD. will sent all the confirmation of orders/
                trades, margin calls, decision/calls to liquidate the
                collateral/ positions/ security, Daily Margin Statement,
                Contract Notes, margin policy on haircuts/ VAR margin, Risk
                management policies, allowable exposure, specific stock exposure
                etc through electronic mode on registered email id and/or mobile
                number of the client updated in the LKP SECURITIES LTD.’s
                database by the client.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              COMPLAINTS RESOLUTION
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                Client shall lodge protest or disagreement with any transaction
                done under the margin trading Funding within 24 hours from the
                date of receipt of such document/statements/contract notes/any
                other communications.
              </li>
              <li>
                Any dispute arising between the client and LKP SECURITIES LTD.
                in connection with the MTF shall be referred to the investor
                grievance redressal mechanism, arbitration mechanism of the
                respective stock exchange.
              </li>
              <li>
                IPF (Investor Protection Fund) shall not be available for
                transactions done on the Stock Exchange, through MTF, in case of
                any losses suffered in connection with the MTF availed by the
                client.
              </li>
            </ol>
          </ul>

          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              LIQUIDATION
              <br />
              LKP SECURITIES LTD. may immediately without any notice liquidate
              the security / collateral and or close out the open positions due
              to the following events:
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                If any instrument for payment of Margin Money / Monies is / are
                dishonored;
              </li>
              <li>
                If the Client violates/breaches any provision of this
                Arrangement or provides any incorrect or misleading information;
              </li>
              <li>
                If the Client has voluntarily or compulsorily become the subject
                of any proceedings under any bankruptcy or insolvency law or
                winding up or liquidation proceedings or has a receiver or
                liquidator appointed in respect of itself or its assets or makes
                an application or refers itself to any authority for being
                declared as a “sick company”, relief undertaking, bankrupt or
                insolvent or seeking financial reconstruction or any other like
                scheme (by whatever name called) or is dissolved or there is a
                change in the constitution whether on account of the admission
                of a new partner or the retirement, death or insolvency of any
                partner or otherwise;
              </li>
              <li>The death or other disability of the Client;</li>
              <li>
                If there is reasonable apprehension that the Client is unable to
                pay its outstanding dues or has admitted its inability to pay
                its dues, as they become payable;
              </li>
              <li>
                {" "}
                If the Client is convicted under any criminal law inforce;
              </li>
              <li>
                If any Asset or any Security is seized or made subject to any
                distress, execution, attachment, injunction or other process
                order or proceeding or is detained or taken into custody for any
                reason;
              </li>
              <li>
                Default under any other arrangement or Funding with any Stock
                Broker is made by the Client.
              </li>
              <li>
                Order passed by any regulatory, courts, statutory bodies etc.
              </li>
              <li>
                All losses and financial charges on account of such
                liquidation/closing out shall be charged to and borne by the
                client.
              </li>
              <li>
                Whenever the securities are liquidated by LKP SECURITIES LTD.,
                the contract note issued for such margin call related
                transaction will carry an risk or identifier that the
                transaction has arisen out of margin call.
              </li>
              <li>
                The client agrees that if the client is not able to maintain
                adequate margins or defaults in bringing adequate margin against
                the margin call then LKP SECURITIES LTD., to mitigate the risk
                may take necessary risk measure and liquidate the funded/
                collateral securities. During such liquidation the most liquid
                funded / collateral securities with the highest value would be
                liquidated first in order to cover the risk.
              </li>
              <li>
                In Case of demerger, merger, amalgamation, rights issue
                corporate action in any eligible securities the client would be
                required to make payment 7 days prior to the ex-date. In case of
                nonpayment, LKP SECURITIES LTD. will liquidate such positions in
                such securities.
              </li>
              <li>
                Client is required to make good the payment of positions of MTF
                trades which are held for more than 30 days, failing which LKP
                SECURITIES LTD. will liquidate such positions.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              TERMINATION OF RELATIONSHIP
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                Client may close / terminate the Margin Trading Account at any
                time after paying the dues with prior notice in writing.
              </li>
              <li>
                The margin trading arrangement between LKP SECURITIES LTD. and
                the client shall be terminated; if the Stock Exchange, for any
                reason, withdraws the margin trading Facility provided to LKP
                SECURITIES LTD. or LKP SECURITIES LTD. surrenders the facility
                or the LKP SECURITIES LTD. ceases to be a member of the stock
                exchange.
              </li>
              <li>
                The MTF may be withdrawn by LKP SECURITIES LTD., in the event of
                client committing any breach of any terms or conditions therein
                or at any time after due intimation to client allowing such time
                to liquidate the MTF position as per the agreed liquidation
                terms without assigning any reason. Similarly, client may opt to
                terminate the margin trading Funding in the event of LKP
                SECURITIES LTD. committing any breach of any terms or conditions
                therein or for any other reason.
              </li>
              <li>
                In the event of termination of this arrangement, the client
                shall forthwith settle the dues of the LKP SECURITIES LTD.. The
                LKP SECURITIES LTD. shall be entitled to immediately adjust the
                Margin Amount against the dues of the client, and the client
                hereby authorizes the LKP SECURITIES LTD. to make such
                adjustment.
              </li>
              <li>
                After such adjustment, if the amount is still due to LKP
                SECURITIES LTD. from the client, the client shall settle the
                same forthwith. Upon full settlement of all the dues of the
                client to LKP SECURITIES LTD., LKP SECURITIES LTD. shall release
                the balance amount to the client.
              </li>
              <li>
                If the client opts to terminate the margin trading Funding, LKP
                SECURITIES LTD. shall forthwith return to the client all the
                collaterals provided and funded securities retained within 5
                working days from the date of clearing of all the dues by
                client.
              </li>
            </ol>
          </ul>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            <li
              style={{
                listStyleType: "none",
                marginTop: "18px",
                fontWeight: 800,
                paddingLeft: "2px",
                color: "black",
                // border: "1px solid black",
              }}
            >
              OTHERS
            </li>
            <ol style={{ margin: "10px", paddingLeft: "18px" }}>
              <li>
                The funds of one client will not be used to provide MTF to
                another client, even if the same is authorized by the first
                client.
              </li>
              <li>
                The Clients Margin Trading Account with no transaction for 30
                days will be settled immediately.
              </li>
              <li>
                The daily margin statements sent by LKP SECURITIES LTD. to the
                client shall identify the margin/ collateral for Margin Trading
                Separately.
              </li>
              <li>
                The dues, wherever mentioned herein above, includes but not
                limited to outstanding balances, interest, statutory taxes,
                duties, charges, penalties etc. in respect of MTF availed by the
                Client.
              </li>
              <li>
                The terms / conditions / Obligations of the Client as amended
                from time to time shall be irrevocable and shall not be revoked
                by the death/dissolution/ winding up of the Client.
              </li>
            </ol>
          </ul>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              name="tncAccepted"
              checked={tncAccepted}
              onChange={(e) => {
                const checked: any = e.target.checked;
                setTncAccepted(checked);
                handleConsentClick(checked);
              }}
              // onClick={handleConsentClick}
              disabled={!isScrolledToBottom}
              sx={{
                color: "grey",
                "&.Mui-checked": { color: "grey" },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: "13px", color: "#000000" }}>
              I have read & accept the MTF Details
            </Typography>
          }
        />

        <Button
          variant="contained"
          sx={{
            color: "#FFF",
            textTransform: "none",
            px: 4,
            py: 1,
            borderRadius: "8px",
            fontWeight: 500,
            backgroundColor: "#11395C",
          }}
          disabled={!tncAccepted}
          onClick={handleOtpPage}
        >
          Enable MTF
        </Button>
      </Box>
    </>
  );
};
export default TermsAndConditions;
