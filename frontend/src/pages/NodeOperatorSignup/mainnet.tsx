import React from "react";
import NodeOperatorSignupPage from "./shared";

const beforeButtonMarkdown = `
## Summary
Aptos Testnet is a shared resource for the community, where data will be preserved, and network configuration mimics Mainnet. See here for how to access Aptos Testnet as a developer [Use Aptos API | Aptos Docs](https://aptos.dev/guides/system-integrators-guide#access-testnet)

We understand that in some unique situations, developers might also want to run their own validator node on the Aptos Testnet. We currently operate a whitelisting program to support this. If you are interested in being a mainnet node operator for Aptos Labs / the Aptos Foundation, please apply under Aptos Mainnet Validator Program.

What you need to do:
1. Read through the dev docs on how to install a validator node [https://aptos.dev/](https://aptos.dev/)
2. Read through the minimum performance requirements for operators running a validator node on testnet (See below).
3. Fill out the application form [https://aptos.typeform.com/to/DPetOnsV](https://aptos.typeform.com/to/DPetOnsV)
4. You will be asked to provide proof / documentation that you are a registered company and team size >3
5. You will hear back within 2 weeks in most cases. If approved, you will get whitelisted and testnet tokens will be airdropped to the address you provided.
`;

const afterButtonMarkdown = `
## Minimum performance standards

If you fail to meet these requirements, your node will be removed from the validator set. You will continue to be whitelisted and can rejoin the validator set at any time, but only after you have fixed the issues with your node. If you are repeatedly booted due to performance issues, then your testnet whitelist may be revoked.
1. Timely updates and right set-up
    - Meet minimal hardware and configuration requirements.
    - Keep software up-to-date with Aptos recommendation.
2. Provide node SLA over 99.9% annually (allows 8 hours and 46 minutes of downtime per year)
    - Uptime for validator/fullnode.
    - Validator participation rate/consensus reputation.
    - Incident response time.
3. Provide 24/7 tech support on-call, we expect teams will initiate issue resolution within 3 hours of alert.

### Liveness

Aptos nodes will have built-in deep health checks to help us evaluate the correctness of each component. Once a validator node is registered in the validatorSet, we will check the below periodically:

- Is the node okay? - pass the[ node health checker](https://nodetools.aptosfoundation.org/#/node_checker)
    - Consensus - 1) actively voting and votes included on chain **[insert Threshold]*- , 2) proposing **[insert Threshold]**
    - State sync - 1) Version is within  **[insert Threshold]*- delta of network, and 2) is making progress
    - Latency
    - Conneciton between validator full node and validator = true
    - Validator connected to all other validators
    - Consensus = increasing votes, and increasing proposals. Delta relates to how long epoch, how much stake. Epoch length and stake amt.
    - State sync = Latest version of rest of chain, and your version is within [1 delta] (function of TPS), i.e. 1k tps
    - Mempool - definite latency - end to end latency of validator and VFN &lt;5 second.
        - When transaction comes into full node, how long it takes to recognise that it has gone into the blockchain

NHC - continuous, click and subscribe. Email sent to person when it fails.

	User subscribe, node health checker fail and check another email. Integrate with pager duty

Storage iops etc - how do we verify hardware requirement.

Telemetry is:
- Node connected? - check if the node is connected to other peers
- Node reachable? - check if the node is accepting connection from other nodes
- Node participating? - check if the node is participating in consensus (voting/proposing)
- Node up-to-date? - check if the node version is recent
- Node reliable? - check if the node reputation is above certain threshold, node uptime is above certain threshold

Our liveness score is calculated by:
- Number of hours where the validator sent at least one push metric to Aptos / Total hours in AIT
- We require a minimum of 99%


### Participation

In the Aptos Blockchain, transactions get grouped into blocks. Each validator takes turns in being a 'proposer' or 'leader' for a round where they build a transaction block and send it to all other validators for consensus. Once enough validators vote, the leader obtains something called a Quorum Certificate - which means the block can be finalized. We want to make sure the validators are actively participating in consensus.

Our node partners need to be able to stand up a node and participate. Participation is defined as being a proposer/leader at least once in an hour.

The calculation for this score is done by:
- Number of hours where a validator was a proposer at least once / Total hours in AIT.
- The minimum threshold is 99%.

### Operational Readiness
Below is a list of operations a node operator needs to have demonstrated in the AITs. The examples below are not exhaustive, and we might add to this list based on network needs.

1. Rollout new releases
2. Rollback from version B to version A
3. Rotating address / keys
4. Update node configuration
5. Restore node from a backup data
6. On-chain voting

### **Disaster Recovery**

DR operation might have lots of overlap with the previous category, since the mitigation method could be rolling out a bug fix or rollback from a bad version etc. For this category we want to understand how node operators target extreme scenarios, like when the network gets attacked, or experiencing a fork.

- DDOS mitigation
- Data corruption / data loss
`;

export default function MainnetNodeOperatorSignupPage() {
    return (
        <NodeOperatorSignupPage
            title="Mainnet Node Operator Signup"
            beforeButtonMarkdown={beforeButtonMarkdown}
            afterButtonMarkdown={afterButtonMarkdown}
        />
    );
}
