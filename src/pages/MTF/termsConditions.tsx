import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const [tncAccepted, setTncAccepted] = useState(false);
  const navigate = useNavigate();

  const handleOtpPage = () => {
    navigate("/otp");
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
            Rahul Sharma
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
            552145651
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
            956478412
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
            rahulsharma12@gmail.com
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
                Stock Broker/Trading Member is eligible to provide MarginTrading
                Funding (MTF)in accordance with SEBI &Exchange Guidelines as
                specified from time to time.
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
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
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
            </ul>
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
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
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
            </ul>
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
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
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
            </ul>
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
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
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
            </ul>
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
              onChange={(e) => setTncAccepted(e.target.checked)}
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
          disabled={!tncAccepted}
          sx={{
            color: "#FFF",
            textTransform: "none",
            px: 4,
            py: 1,
            borderRadius: "8px",
            fontWeight: 500,
            backgroundColor: "#11395C",
          }}
          onClick={handleOtpPage}
        >
          Enable MTF
        </Button>
      </Box>
    </>
  );
};
export default TermsAndConditions;
