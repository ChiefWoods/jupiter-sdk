import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    combineCodec,
    getArrayDecoder,
    getArrayEncoder,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    getUnitDecoder,
    getUnitEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
    type Option,
    type OptionOrNullable,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getBisonFiPredictSideDecoder,
    getBisonFiPredictSideEncoder,
    type BisonFiPredictSide,
    type BisonFiPredictSideArgs,
} from '../types/bisonFiPredictSide';
import {
    getCandidateSwapDecoder,
    getCandidateSwapEncoder,
    type CandidateSwap,
    type CandidateSwapArgs,
} from '../types/candidateSwap';
import {
    getCandidateSwapWithBpsDecoder,
    getCandidateSwapWithBpsEncoder,
    type CandidateSwapWithBps,
    type CandidateSwapWithBpsArgs,
} from '../types/candidateSwapWithBps';
import {
    getHyloSwapTypeDecoder,
    getHyloSwapTypeEncoder,
    type HyloSwapType,
    type HyloSwapTypeArgs,
} from '../types/hyloSwapType';
import {
    getRemainingAccountsInfoDecoder,
    getRemainingAccountsInfoEncoder,
    type RemainingAccountsInfo,
    type RemainingAccountsInfoArgs,
} from '../types/remainingAccountsInfo';
import {
    getSanctumSolsSwapTypeDecoder,
    getSanctumSolsSwapTypeEncoder,
    type SanctumSolsSwapType,
    type SanctumSolsSwapTypeArgs,
} from '../types/sanctumSolsSwapType';
import { getSideDecoder, getSideEncoder, type Side, type SideArgs } from '../types/side';

export type SwapType =
    | { __kind: 'Saber' }
    | { __kind: 'SaberAddDecimalsDeposit' }
    | { __kind: 'SaberAddDecimalsWithdraw' }
    | { __kind: 'TokenSwap' }
    | { __kind: 'Sencha' }
    | { __kind: 'Step' }
    | { __kind: 'Cropper' }
    | { __kind: 'Raydium' }
    | { __kind: 'Crema'; aToB: boolean }
    | { __kind: 'Lifinity' }
    | { __kind: 'Mercurial' }
    | { __kind: 'Cykura' }
    | { __kind: 'Serum'; side: Side }
    | { __kind: 'MarinadeDeposit' }
    | { __kind: 'MarinadeUnstake' }
    | { __kind: 'Aldrin'; side: Side }
    | { __kind: 'AldrinV2'; side: Side }
    | { __kind: 'Whirlpool'; aToB: boolean }
    | { __kind: 'Invariant'; xToY: boolean }
    | { __kind: 'Meteora' }
    | { __kind: 'GooseFX' }
    | { __kind: 'DeltaFi'; stable: boolean }
    | { __kind: 'Balansol' }
    | { __kind: 'MarcoPolo'; xToY: boolean }
    | { __kind: 'Dradex'; side: Side }
    | { __kind: 'LifinityV2' }
    | { __kind: 'RaydiumClmm' }
    | { __kind: 'Openbook'; side: Side }
    | { __kind: 'Phoenix'; side: Side }
    | { __kind: 'Symmetry'; fromTokenId: bigint; toTokenId: bigint }
    | { __kind: 'TokenSwapV2' }
    | { __kind: 'HeliumTreasuryManagementRedeemV0' }
    | { __kind: 'StakeDexStakeWrappedSol' }
    | { __kind: 'StakeDexSwapViaStake'; bridgeStakeSeed: number }
    | { __kind: 'GooseFXV2' }
    | { __kind: 'Perps' }
    | { __kind: 'PerpsAddLiquidity' }
    | { __kind: 'PerpsRemoveLiquidity' }
    | { __kind: 'MeteoraDlmm' }
    | { __kind: 'OpenBookV2'; side: Side }
    | { __kind: 'RaydiumClmmV2' }
    | { __kind: 'StakeDexPrefundWithdrawStakeAndDepositStake'; bridgeStakeSeed: number }
    | { __kind: 'Clone'; poolIndex: number; quantityIsInput: boolean; quantityIsCollateral: boolean }
    | {
          __kind: 'SanctumS';
          srcLstValueCalcAccs: number;
          dstLstValueCalcAccs: number;
          srcLstIndex: number;
          dstLstIndex: number;
      }
    | { __kind: 'SanctumSAddLiquidity'; lstValueCalcAccs: number; lstIndex: number }
    | { __kind: 'SanctumSRemoveLiquidity'; lstValueCalcAccs: number; lstIndex: number }
    | { __kind: 'RaydiumCP' }
    | { __kind: 'WhirlpoolSwapV2'; aToB: boolean; remainingAccountsInfo: Option<RemainingAccountsInfo> }
    | { __kind: 'OneIntro' }
    | { __kind: 'PumpWrappedBuy' }
    | { __kind: 'PumpWrappedSell' }
    | { __kind: 'PerpsV2' }
    | { __kind: 'PerpsV2AddLiquidity' }
    | { __kind: 'PerpsV2RemoveLiquidity' }
    | { __kind: 'MoonshotWrappedBuy' }
    | { __kind: 'MoonshotWrappedSell' }
    | { __kind: 'StabbleStableSwap' }
    | { __kind: 'StabbleWeightedSwap' }
    | { __kind: 'Obric'; xToY: boolean }
    | { __kind: 'FoxBuyFromEstimatedCost' }
    | { __kind: 'FoxClaimPartial'; isY: boolean }
    | { __kind: 'SolFi'; isQuoteToBase: boolean }
    | { __kind: 'SolayerDelegateNoInit' }
    | { __kind: 'SolayerUndelegateNoInit' }
    | { __kind: 'TokenMill'; side: Side }
    | { __kind: 'DaosFunBuy' }
    | { __kind: 'DaosFunSell' }
    | { __kind: 'ZeroFi' }
    | { __kind: 'StakeDexWithdrawWrappedSol' }
    | { __kind: 'VirtualsBuy' }
    | { __kind: 'VirtualsSell' }
    | { __kind: 'Perena'; inIndex: number; outIndex: number }
    | { __kind: 'PumpSwapBuy' }
    | { __kind: 'PumpSwapSell' }
    | { __kind: 'Gamma' }
    | { __kind: 'MeteoraDlmmSwapV2'; remainingAccountsInfo: RemainingAccountsInfo }
    | { __kind: 'Woofi' }
    | { __kind: 'MeteoraDammV2' }
    | { __kind: 'MeteoraDynamicBondingCurveSwap' }
    | { __kind: 'StabbleStableSwapV2' }
    | { __kind: 'StabbleWeightedSwapV2' }
    | { __kind: 'RaydiumLaunchlabBuy'; shareFeeRate: bigint }
    | { __kind: 'RaydiumLaunchlabSell'; shareFeeRate: bigint }
    | { __kind: 'BoopdotfunWrappedBuy' }
    | { __kind: 'BoopdotfunWrappedSell' }
    | { __kind: 'Plasma'; side: Side }
    | { __kind: 'GoonFi'; isBid: boolean; blacklistBump: number }
    | { __kind: 'HumidiFi'; swapId: bigint; isBaseToQuote: boolean }
    | { __kind: 'MeteoraDynamicBondingCurveSwapWithRemainingAccounts' }
    | { __kind: 'TesseraV'; side: Side }
    | { __kind: 'PumpWrappedBuyV2' }
    | { __kind: 'PumpWrappedSellV2' }
    | { __kind: 'PumpSwapBuyV2' }
    | { __kind: 'PumpSwapSellV2' }
    | { __kind: 'Heaven'; aToB: boolean }
    | { __kind: 'SolFiV2'; isQuoteToBase: boolean }
    | { __kind: 'Aquifer' }
    | { __kind: 'PumpWrappedBuyV3' }
    | { __kind: 'PumpWrappedSellV3' }
    | { __kind: 'PumpSwapBuyV3' }
    | { __kind: 'PumpSwapSellV3' }
    | { __kind: 'JupiterLendDeposit' }
    | { __kind: 'JupiterLendRedeem' }
    | { __kind: 'DefiTuna'; aToB: boolean; remainingAccountsInfo: Option<RemainingAccountsInfo> }
    | { __kind: 'AlphaQ'; aToB: boolean }
    | { __kind: 'RaydiumV2' }
    | { __kind: 'SarosDlmm'; swapForY: boolean }
    | { __kind: 'Futarchy'; side: Side }
    | { __kind: 'MeteoraDammV2WithRemainingAccounts' }
    | { __kind: 'Obsidian' }
    | { __kind: 'WhaleStreet'; side: Side }
    | { __kind: 'DynamicV1'; candidateSwaps: Array<CandidateSwap>; bestPosition: Option<number> }
    | { __kind: 'PumpWrappedBuyV4' }
    | { __kind: 'PumpWrappedSellV4' }
    | { __kind: 'CarrotIssue' }
    | { __kind: 'CarrotRedeem' }
    | { __kind: 'Manifest'; side: Side }
    | { __kind: 'BisonFi'; aToB: boolean }
    | { __kind: 'HumidiFiV2'; swapId: bigint; isBaseToQuote: boolean }
    | { __kind: 'PerenaStar'; isMint: boolean }
    | { __kind: 'JupiterRfqV2'; side: Side; fillData: ReadonlyUint8Array }
    | { __kind: 'GoonFiV2'; isBid: boolean }
    | { __kind: 'Scorch'; swapId: bigint }
    | { __kind: 'VaultLiquidUnstake'; lstAmounts: Array<bigint>; seed: bigint }
    | { __kind: 'XOrca' }
    | { __kind: 'Quantum'; side: Side }
    | { __kind: 'WhaleStreetV2'; side: Side; authAmountIn: bigint; auth: bigint }
    | { __kind: 'Riptide'; amountIsTokenA: boolean }
    | { __kind: 'RunnerRodeo' }
    | { __kind: 'TaurusFi'; isBaseIn: boolean }
    | { __kind: 'Omnipair' }
    | { __kind: 'MSwap' }
    | { __kind: 'Hylo'; swapType: HyloSwapType }
    | { __kind: 'VoltrDeposit' }
    | { __kind: 'VoltrWithdraw' }
    | {
          __kind: 'SanctumSV2';
          srcLstValueCalcAccs: number;
          dstLstValueCalcAccs: number;
          srcLstIndex: number;
          dstLstIndex: number;
      }
    | { __kind: 'LemmingsFi'; isBaseIn: boolean }
    | { __kind: 'ScaleVmmBuy' }
    | { __kind: 'ScaleVmmSell' }
    | { __kind: 'ScaleAmmBuy' }
    | { __kind: 'ScaleAmmSell' }
    | { __kind: 'BisonFiV2'; aToB: boolean }
    | { __kind: 'Trends' }
    | { __kind: 'HumaDeposit' }
    | { __kind: 'HumaInstantWithdraw' }
    | { __kind: 'Kipseli'; isBaseToQuote: boolean }
    | {
          __kind: 'DynamicV2';
          candidateSwaps: Array<CandidateSwapWithBps>;
          maxSplitQuoteCalls: number;
          maxSplitCandidates: number;
      }
    | { __kind: 'PumpSwapBuyV3WithCashbackClaim' }
    | { __kind: 'PumpSwapSellV3WithCashbackClaim' }
    | { __kind: 'PumpWrappedBuyV4WithCashbackClaim' }
    | { __kind: 'PumpWrappedSellV4WithCashbackClaim' }
    | { __kind: 'GoonFiV3'; isBid: boolean }
    | { __kind: 'PumpWrappedBuyV5'; claimCashback: boolean }
    | { __kind: 'PumpWrappedSellV5'; claimCashback: boolean }
    | { __kind: 'ZeroFiSwapV2' }
    | { __kind: 'BisonFiPredict'; side: BisonFiPredictSide; isBuy: boolean }
    | { __kind: 'ByrealDynamicV3' }
    | { __kind: 'Flux'; swapId: bigint; baseToQuote: boolean }
    | { __kind: 'VaultLiquidSellLst' }
    | { __kind: 'VaultLiquidBuyLst'; lstAmount: bigint }
    | { __kind: 'KipseliV2'; isBaseToQuote: boolean }
    | { __kind: 'Deriverse'; side: Side; instrId: number }
    | { __kind: 'Hadron'; isX: boolean }
    | { __kind: 'BinaryFi' }
    | { __kind: 'Metric'; zeroForOne: boolean }
    | { __kind: 'JupiterLendDexSwap'; swap0to1: boolean }
    | { __kind: 'Gatorswap'; baseToQuote: boolean }
    | { __kind: 'Flint'; isGlobal: boolean; takerBuy: boolean }
    | { __kind: 'Denali'; baseToQuote: boolean }
    | { __kind: 'PerenaStarV2Deposit' }
    | { __kind: 'PerenaStarV2WithdrawFromExternal'; externalLiquiditySource: number }
    | { __kind: 'SanctumSols'; swapType: SanctumSolsSwapType };

export type SwapTypeArgs =
    | { __kind: 'Saber' }
    | { __kind: 'SaberAddDecimalsDeposit' }
    | { __kind: 'SaberAddDecimalsWithdraw' }
    | { __kind: 'TokenSwap' }
    | { __kind: 'Sencha' }
    | { __kind: 'Step' }
    | { __kind: 'Cropper' }
    | { __kind: 'Raydium' }
    | { __kind: 'Crema'; aToB: boolean }
    | { __kind: 'Lifinity' }
    | { __kind: 'Mercurial' }
    | { __kind: 'Cykura' }
    | { __kind: 'Serum'; side: SideArgs }
    | { __kind: 'MarinadeDeposit' }
    | { __kind: 'MarinadeUnstake' }
    | { __kind: 'Aldrin'; side: SideArgs }
    | { __kind: 'AldrinV2'; side: SideArgs }
    | { __kind: 'Whirlpool'; aToB: boolean }
    | { __kind: 'Invariant'; xToY: boolean }
    | { __kind: 'Meteora' }
    | { __kind: 'GooseFX' }
    | { __kind: 'DeltaFi'; stable: boolean }
    | { __kind: 'Balansol' }
    | { __kind: 'MarcoPolo'; xToY: boolean }
    | { __kind: 'Dradex'; side: SideArgs }
    | { __kind: 'LifinityV2' }
    | { __kind: 'RaydiumClmm' }
    | { __kind: 'Openbook'; side: SideArgs }
    | { __kind: 'Phoenix'; side: SideArgs }
    | { __kind: 'Symmetry'; fromTokenId: number | bigint; toTokenId: number | bigint }
    | { __kind: 'TokenSwapV2' }
    | { __kind: 'HeliumTreasuryManagementRedeemV0' }
    | { __kind: 'StakeDexStakeWrappedSol' }
    | { __kind: 'StakeDexSwapViaStake'; bridgeStakeSeed: number }
    | { __kind: 'GooseFXV2' }
    | { __kind: 'Perps' }
    | { __kind: 'PerpsAddLiquidity' }
    | { __kind: 'PerpsRemoveLiquidity' }
    | { __kind: 'MeteoraDlmm' }
    | { __kind: 'OpenBookV2'; side: SideArgs }
    | { __kind: 'RaydiumClmmV2' }
    | { __kind: 'StakeDexPrefundWithdrawStakeAndDepositStake'; bridgeStakeSeed: number }
    | { __kind: 'Clone'; poolIndex: number; quantityIsInput: boolean; quantityIsCollateral: boolean }
    | {
          __kind: 'SanctumS';
          srcLstValueCalcAccs: number;
          dstLstValueCalcAccs: number;
          srcLstIndex: number;
          dstLstIndex: number;
      }
    | { __kind: 'SanctumSAddLiquidity'; lstValueCalcAccs: number; lstIndex: number }
    | { __kind: 'SanctumSRemoveLiquidity'; lstValueCalcAccs: number; lstIndex: number }
    | { __kind: 'RaydiumCP' }
    | { __kind: 'WhirlpoolSwapV2'; aToB: boolean; remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs> }
    | { __kind: 'OneIntro' }
    | { __kind: 'PumpWrappedBuy' }
    | { __kind: 'PumpWrappedSell' }
    | { __kind: 'PerpsV2' }
    | { __kind: 'PerpsV2AddLiquidity' }
    | { __kind: 'PerpsV2RemoveLiquidity' }
    | { __kind: 'MoonshotWrappedBuy' }
    | { __kind: 'MoonshotWrappedSell' }
    | { __kind: 'StabbleStableSwap' }
    | { __kind: 'StabbleWeightedSwap' }
    | { __kind: 'Obric'; xToY: boolean }
    | { __kind: 'FoxBuyFromEstimatedCost' }
    | { __kind: 'FoxClaimPartial'; isY: boolean }
    | { __kind: 'SolFi'; isQuoteToBase: boolean }
    | { __kind: 'SolayerDelegateNoInit' }
    | { __kind: 'SolayerUndelegateNoInit' }
    | { __kind: 'TokenMill'; side: SideArgs }
    | { __kind: 'DaosFunBuy' }
    | { __kind: 'DaosFunSell' }
    | { __kind: 'ZeroFi' }
    | { __kind: 'StakeDexWithdrawWrappedSol' }
    | { __kind: 'VirtualsBuy' }
    | { __kind: 'VirtualsSell' }
    | { __kind: 'Perena'; inIndex: number; outIndex: number }
    | { __kind: 'PumpSwapBuy' }
    | { __kind: 'PumpSwapSell' }
    | { __kind: 'Gamma' }
    | { __kind: 'MeteoraDlmmSwapV2'; remainingAccountsInfo: RemainingAccountsInfoArgs }
    | { __kind: 'Woofi' }
    | { __kind: 'MeteoraDammV2' }
    | { __kind: 'MeteoraDynamicBondingCurveSwap' }
    | { __kind: 'StabbleStableSwapV2' }
    | { __kind: 'StabbleWeightedSwapV2' }
    | { __kind: 'RaydiumLaunchlabBuy'; shareFeeRate: number | bigint }
    | { __kind: 'RaydiumLaunchlabSell'; shareFeeRate: number | bigint }
    | { __kind: 'BoopdotfunWrappedBuy' }
    | { __kind: 'BoopdotfunWrappedSell' }
    | { __kind: 'Plasma'; side: SideArgs }
    | { __kind: 'GoonFi'; isBid: boolean; blacklistBump: number }
    | { __kind: 'HumidiFi'; swapId: number | bigint; isBaseToQuote: boolean }
    | { __kind: 'MeteoraDynamicBondingCurveSwapWithRemainingAccounts' }
    | { __kind: 'TesseraV'; side: SideArgs }
    | { __kind: 'PumpWrappedBuyV2' }
    | { __kind: 'PumpWrappedSellV2' }
    | { __kind: 'PumpSwapBuyV2' }
    | { __kind: 'PumpSwapSellV2' }
    | { __kind: 'Heaven'; aToB: boolean }
    | { __kind: 'SolFiV2'; isQuoteToBase: boolean }
    | { __kind: 'Aquifer' }
    | { __kind: 'PumpWrappedBuyV3' }
    | { __kind: 'PumpWrappedSellV3' }
    | { __kind: 'PumpSwapBuyV3' }
    | { __kind: 'PumpSwapSellV3' }
    | { __kind: 'JupiterLendDeposit' }
    | { __kind: 'JupiterLendRedeem' }
    | { __kind: 'DefiTuna'; aToB: boolean; remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs> }
    | { __kind: 'AlphaQ'; aToB: boolean }
    | { __kind: 'RaydiumV2' }
    | { __kind: 'SarosDlmm'; swapForY: boolean }
    | { __kind: 'Futarchy'; side: SideArgs }
    | { __kind: 'MeteoraDammV2WithRemainingAccounts' }
    | { __kind: 'Obsidian' }
    | { __kind: 'WhaleStreet'; side: SideArgs }
    | { __kind: 'DynamicV1'; candidateSwaps: Array<CandidateSwapArgs>; bestPosition: OptionOrNullable<number> }
    | { __kind: 'PumpWrappedBuyV4' }
    | { __kind: 'PumpWrappedSellV4' }
    | { __kind: 'CarrotIssue' }
    | { __kind: 'CarrotRedeem' }
    | { __kind: 'Manifest'; side: SideArgs }
    | { __kind: 'BisonFi'; aToB: boolean }
    | { __kind: 'HumidiFiV2'; swapId: number | bigint; isBaseToQuote: boolean }
    | { __kind: 'PerenaStar'; isMint: boolean }
    | { __kind: 'JupiterRfqV2'; side: SideArgs; fillData: ReadonlyUint8Array }
    | { __kind: 'GoonFiV2'; isBid: boolean }
    | { __kind: 'Scorch'; swapId: number | bigint }
    | { __kind: 'VaultLiquidUnstake'; lstAmounts: Array<number | bigint>; seed: number | bigint }
    | { __kind: 'XOrca' }
    | { __kind: 'Quantum'; side: SideArgs }
    | { __kind: 'WhaleStreetV2'; side: SideArgs; authAmountIn: number | bigint; auth: number | bigint }
    | { __kind: 'Riptide'; amountIsTokenA: boolean }
    | { __kind: 'RunnerRodeo' }
    | { __kind: 'TaurusFi'; isBaseIn: boolean }
    | { __kind: 'Omnipair' }
    | { __kind: 'MSwap' }
    | { __kind: 'Hylo'; swapType: HyloSwapTypeArgs }
    | { __kind: 'VoltrDeposit' }
    | { __kind: 'VoltrWithdraw' }
    | {
          __kind: 'SanctumSV2';
          srcLstValueCalcAccs: number;
          dstLstValueCalcAccs: number;
          srcLstIndex: number;
          dstLstIndex: number;
      }
    | { __kind: 'LemmingsFi'; isBaseIn: boolean }
    | { __kind: 'ScaleVmmBuy' }
    | { __kind: 'ScaleVmmSell' }
    | { __kind: 'ScaleAmmBuy' }
    | { __kind: 'ScaleAmmSell' }
    | { __kind: 'BisonFiV2'; aToB: boolean }
    | { __kind: 'Trends' }
    | { __kind: 'HumaDeposit' }
    | { __kind: 'HumaInstantWithdraw' }
    | { __kind: 'Kipseli'; isBaseToQuote: boolean }
    | {
          __kind: 'DynamicV2';
          candidateSwaps: Array<CandidateSwapWithBpsArgs>;
          maxSplitQuoteCalls: number;
          maxSplitCandidates: number;
      }
    | { __kind: 'PumpSwapBuyV3WithCashbackClaim' }
    | { __kind: 'PumpSwapSellV3WithCashbackClaim' }
    | { __kind: 'PumpWrappedBuyV4WithCashbackClaim' }
    | { __kind: 'PumpWrappedSellV4WithCashbackClaim' }
    | { __kind: 'GoonFiV3'; isBid: boolean }
    | { __kind: 'PumpWrappedBuyV5'; claimCashback: boolean }
    | { __kind: 'PumpWrappedSellV5'; claimCashback: boolean }
    | { __kind: 'ZeroFiSwapV2' }
    | { __kind: 'BisonFiPredict'; side: BisonFiPredictSideArgs; isBuy: boolean }
    | { __kind: 'ByrealDynamicV3' }
    | { __kind: 'Flux'; swapId: number | bigint; baseToQuote: boolean }
    | { __kind: 'VaultLiquidSellLst' }
    | { __kind: 'VaultLiquidBuyLst'; lstAmount: number | bigint }
    | { __kind: 'KipseliV2'; isBaseToQuote: boolean }
    | { __kind: 'Deriverse'; side: SideArgs; instrId: number }
    | { __kind: 'Hadron'; isX: boolean }
    | { __kind: 'BinaryFi' }
    | { __kind: 'Metric'; zeroForOne: boolean }
    | { __kind: 'JupiterLendDexSwap'; swap0to1: boolean }
    | { __kind: 'Gatorswap'; baseToQuote: boolean }
    | { __kind: 'Flint'; isGlobal: boolean; takerBuy: boolean }
    | { __kind: 'Denali'; baseToQuote: boolean }
    | { __kind: 'PerenaStarV2Deposit' }
    | { __kind: 'PerenaStarV2WithdrawFromExternal'; externalLiquiditySource: number }
    | { __kind: 'SanctumSols'; swapType: SanctumSolsSwapTypeArgs };

export function getSwapTypeEncoder(): Encoder<SwapTypeArgs> {
    return getDiscriminatedUnionEncoder([
        ['Saber', getUnitEncoder()],
        ['SaberAddDecimalsDeposit', getUnitEncoder()],
        ['SaberAddDecimalsWithdraw', getUnitEncoder()],
        ['TokenSwap', getUnitEncoder()],
        ['Sencha', getUnitEncoder()],
        ['Step', getUnitEncoder()],
        ['Cropper', getUnitEncoder()],
        ['Raydium', getUnitEncoder()],
        ['Crema', getStructEncoder([['aToB', getBooleanEncoder()]])],
        ['Lifinity', getUnitEncoder()],
        ['Mercurial', getUnitEncoder()],
        ['Cykura', getUnitEncoder()],
        ['Serum', getStructEncoder([['side', getSideEncoder()]])],
        ['MarinadeDeposit', getUnitEncoder()],
        ['MarinadeUnstake', getUnitEncoder()],
        ['Aldrin', getStructEncoder([['side', getSideEncoder()]])],
        ['AldrinV2', getStructEncoder([['side', getSideEncoder()]])],
        ['Whirlpool', getStructEncoder([['aToB', getBooleanEncoder()]])],
        ['Invariant', getStructEncoder([['xToY', getBooleanEncoder()]])],
        ['Meteora', getUnitEncoder()],
        ['GooseFX', getUnitEncoder()],
        ['DeltaFi', getStructEncoder([['stable', getBooleanEncoder()]])],
        ['Balansol', getUnitEncoder()],
        ['MarcoPolo', getStructEncoder([['xToY', getBooleanEncoder()]])],
        ['Dradex', getStructEncoder([['side', getSideEncoder()]])],
        ['LifinityV2', getUnitEncoder()],
        ['RaydiumClmm', getUnitEncoder()],
        ['Openbook', getStructEncoder([['side', getSideEncoder()]])],
        ['Phoenix', getStructEncoder([['side', getSideEncoder()]])],
        [
            'Symmetry',
            getStructEncoder([
                ['fromTokenId', getU64Encoder()],
                ['toTokenId', getU64Encoder()],
            ]),
        ],
        ['TokenSwapV2', getUnitEncoder()],
        ['HeliumTreasuryManagementRedeemV0', getUnitEncoder()],
        ['StakeDexStakeWrappedSol', getUnitEncoder()],
        ['StakeDexSwapViaStake', getStructEncoder([['bridgeStakeSeed', getU32Encoder()]])],
        ['GooseFXV2', getUnitEncoder()],
        ['Perps', getUnitEncoder()],
        ['PerpsAddLiquidity', getUnitEncoder()],
        ['PerpsRemoveLiquidity', getUnitEncoder()],
        ['MeteoraDlmm', getUnitEncoder()],
        ['OpenBookV2', getStructEncoder([['side', getSideEncoder()]])],
        ['RaydiumClmmV2', getUnitEncoder()],
        ['StakeDexPrefundWithdrawStakeAndDepositStake', getStructEncoder([['bridgeStakeSeed', getU32Encoder()]])],
        [
            'Clone',
            getStructEncoder([
                ['poolIndex', getU8Encoder()],
                ['quantityIsInput', getBooleanEncoder()],
                ['quantityIsCollateral', getBooleanEncoder()],
            ]),
        ],
        [
            'SanctumS',
            getStructEncoder([
                ['srcLstValueCalcAccs', getU8Encoder()],
                ['dstLstValueCalcAccs', getU8Encoder()],
                ['srcLstIndex', getU32Encoder()],
                ['dstLstIndex', getU32Encoder()],
            ]),
        ],
        [
            'SanctumSAddLiquidity',
            getStructEncoder([
                ['lstValueCalcAccs', getU8Encoder()],
                ['lstIndex', getU32Encoder()],
            ]),
        ],
        [
            'SanctumSRemoveLiquidity',
            getStructEncoder([
                ['lstValueCalcAccs', getU8Encoder()],
                ['lstIndex', getU32Encoder()],
            ]),
        ],
        ['RaydiumCP', getUnitEncoder()],
        [
            'WhirlpoolSwapV2',
            getStructEncoder([
                ['aToB', getBooleanEncoder()],
                ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
            ]),
        ],
        ['OneIntro', getUnitEncoder()],
        ['PumpWrappedBuy', getUnitEncoder()],
        ['PumpWrappedSell', getUnitEncoder()],
        ['PerpsV2', getUnitEncoder()],
        ['PerpsV2AddLiquidity', getUnitEncoder()],
        ['PerpsV2RemoveLiquidity', getUnitEncoder()],
        ['MoonshotWrappedBuy', getUnitEncoder()],
        ['MoonshotWrappedSell', getUnitEncoder()],
        ['StabbleStableSwap', getUnitEncoder()],
        ['StabbleWeightedSwap', getUnitEncoder()],
        ['Obric', getStructEncoder([['xToY', getBooleanEncoder()]])],
        ['FoxBuyFromEstimatedCost', getUnitEncoder()],
        ['FoxClaimPartial', getStructEncoder([['isY', getBooleanEncoder()]])],
        ['SolFi', getStructEncoder([['isQuoteToBase', getBooleanEncoder()]])],
        ['SolayerDelegateNoInit', getUnitEncoder()],
        ['SolayerUndelegateNoInit', getUnitEncoder()],
        ['TokenMill', getStructEncoder([['side', getSideEncoder()]])],
        ['DaosFunBuy', getUnitEncoder()],
        ['DaosFunSell', getUnitEncoder()],
        ['ZeroFi', getUnitEncoder()],
        ['StakeDexWithdrawWrappedSol', getUnitEncoder()],
        ['VirtualsBuy', getUnitEncoder()],
        ['VirtualsSell', getUnitEncoder()],
        [
            'Perena',
            getStructEncoder([
                ['inIndex', getU8Encoder()],
                ['outIndex', getU8Encoder()],
            ]),
        ],
        ['PumpSwapBuy', getUnitEncoder()],
        ['PumpSwapSell', getUnitEncoder()],
        ['Gamma', getUnitEncoder()],
        ['MeteoraDlmmSwapV2', getStructEncoder([['remainingAccountsInfo', getRemainingAccountsInfoEncoder()]])],
        ['Woofi', getUnitEncoder()],
        ['MeteoraDammV2', getUnitEncoder()],
        ['MeteoraDynamicBondingCurveSwap', getUnitEncoder()],
        ['StabbleStableSwapV2', getUnitEncoder()],
        ['StabbleWeightedSwapV2', getUnitEncoder()],
        ['RaydiumLaunchlabBuy', getStructEncoder([['shareFeeRate', getU64Encoder()]])],
        ['RaydiumLaunchlabSell', getStructEncoder([['shareFeeRate', getU64Encoder()]])],
        ['BoopdotfunWrappedBuy', getUnitEncoder()],
        ['BoopdotfunWrappedSell', getUnitEncoder()],
        ['Plasma', getStructEncoder([['side', getSideEncoder()]])],
        [
            'GoonFi',
            getStructEncoder([
                ['isBid', getBooleanEncoder()],
                ['blacklistBump', getU8Encoder()],
            ]),
        ],
        [
            'HumidiFi',
            getStructEncoder([
                ['swapId', getU64Encoder()],
                ['isBaseToQuote', getBooleanEncoder()],
            ]),
        ],
        ['MeteoraDynamicBondingCurveSwapWithRemainingAccounts', getUnitEncoder()],
        ['TesseraV', getStructEncoder([['side', getSideEncoder()]])],
        ['PumpWrappedBuyV2', getUnitEncoder()],
        ['PumpWrappedSellV2', getUnitEncoder()],
        ['PumpSwapBuyV2', getUnitEncoder()],
        ['PumpSwapSellV2', getUnitEncoder()],
        ['Heaven', getStructEncoder([['aToB', getBooleanEncoder()]])],
        ['SolFiV2', getStructEncoder([['isQuoteToBase', getBooleanEncoder()]])],
        ['Aquifer', getUnitEncoder()],
        ['PumpWrappedBuyV3', getUnitEncoder()],
        ['PumpWrappedSellV3', getUnitEncoder()],
        ['PumpSwapBuyV3', getUnitEncoder()],
        ['PumpSwapSellV3', getUnitEncoder()],
        ['JupiterLendDeposit', getUnitEncoder()],
        ['JupiterLendRedeem', getUnitEncoder()],
        [
            'DefiTuna',
            getStructEncoder([
                ['aToB', getBooleanEncoder()],
                ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
            ]),
        ],
        ['AlphaQ', getStructEncoder([['aToB', getBooleanEncoder()]])],
        ['RaydiumV2', getUnitEncoder()],
        ['SarosDlmm', getStructEncoder([['swapForY', getBooleanEncoder()]])],
        ['Futarchy', getStructEncoder([['side', getSideEncoder()]])],
        ['MeteoraDammV2WithRemainingAccounts', getUnitEncoder()],
        ['Obsidian', getUnitEncoder()],
        ['WhaleStreet', getStructEncoder([['side', getSideEncoder()]])],
        [
            'DynamicV1',
            getStructEncoder([
                ['candidateSwaps', getArrayEncoder(getCandidateSwapEncoder())],
                ['bestPosition', getOptionEncoder(getU8Encoder())],
            ]),
        ],
        ['PumpWrappedBuyV4', getUnitEncoder()],
        ['PumpWrappedSellV4', getUnitEncoder()],
        ['CarrotIssue', getUnitEncoder()],
        ['CarrotRedeem', getUnitEncoder()],
        ['Manifest', getStructEncoder([['side', getSideEncoder()]])],
        ['BisonFi', getStructEncoder([['aToB', getBooleanEncoder()]])],
        [
            'HumidiFiV2',
            getStructEncoder([
                ['swapId', getU64Encoder()],
                ['isBaseToQuote', getBooleanEncoder()],
            ]),
        ],
        ['PerenaStar', getStructEncoder([['isMint', getBooleanEncoder()]])],
        [
            'JupiterRfqV2',
            getStructEncoder([
                ['side', getSideEncoder()],
                ['fillData', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
            ]),
        ],
        ['GoonFiV2', getStructEncoder([['isBid', getBooleanEncoder()]])],
        ['Scorch', getStructEncoder([['swapId', getU128Encoder()]])],
        [
            'VaultLiquidUnstake',
            getStructEncoder([
                ['lstAmounts', getArrayEncoder(getU64Encoder(), { size: 5 })],
                ['seed', getU64Encoder()],
            ]),
        ],
        ['XOrca', getUnitEncoder()],
        ['Quantum', getStructEncoder([['side', getSideEncoder()]])],
        [
            'WhaleStreetV2',
            getStructEncoder([
                ['side', getSideEncoder()],
                ['authAmountIn', getU64Encoder()],
                ['auth', getU64Encoder()],
            ]),
        ],
        ['Riptide', getStructEncoder([['amountIsTokenA', getBooleanEncoder()]])],
        ['RunnerRodeo', getUnitEncoder()],
        ['TaurusFi', getStructEncoder([['isBaseIn', getBooleanEncoder()]])],
        ['Omnipair', getUnitEncoder()],
        ['MSwap', getUnitEncoder()],
        ['Hylo', getStructEncoder([['swapType', getHyloSwapTypeEncoder()]])],
        ['VoltrDeposit', getUnitEncoder()],
        ['VoltrWithdraw', getUnitEncoder()],
        [
            'SanctumSV2',
            getStructEncoder([
                ['srcLstValueCalcAccs', getU8Encoder()],
                ['dstLstValueCalcAccs', getU8Encoder()],
                ['srcLstIndex', getU32Encoder()],
                ['dstLstIndex', getU32Encoder()],
            ]),
        ],
        ['LemmingsFi', getStructEncoder([['isBaseIn', getBooleanEncoder()]])],
        ['ScaleVmmBuy', getUnitEncoder()],
        ['ScaleVmmSell', getUnitEncoder()],
        ['ScaleAmmBuy', getUnitEncoder()],
        ['ScaleAmmSell', getUnitEncoder()],
        ['BisonFiV2', getStructEncoder([['aToB', getBooleanEncoder()]])],
        ['Trends', getUnitEncoder()],
        ['HumaDeposit', getUnitEncoder()],
        ['HumaInstantWithdraw', getUnitEncoder()],
        ['Kipseli', getStructEncoder([['isBaseToQuote', getBooleanEncoder()]])],
        [
            'DynamicV2',
            getStructEncoder([
                ['candidateSwaps', getArrayEncoder(getCandidateSwapWithBpsEncoder())],
                ['maxSplitQuoteCalls', getU8Encoder()],
                ['maxSplitCandidates', getU8Encoder()],
            ]),
        ],
        ['PumpSwapBuyV3WithCashbackClaim', getUnitEncoder()],
        ['PumpSwapSellV3WithCashbackClaim', getUnitEncoder()],
        ['PumpWrappedBuyV4WithCashbackClaim', getUnitEncoder()],
        ['PumpWrappedSellV4WithCashbackClaim', getUnitEncoder()],
        ['GoonFiV3', getStructEncoder([['isBid', getBooleanEncoder()]])],
        ['PumpWrappedBuyV5', getStructEncoder([['claimCashback', getBooleanEncoder()]])],
        ['PumpWrappedSellV5', getStructEncoder([['claimCashback', getBooleanEncoder()]])],
        ['ZeroFiSwapV2', getUnitEncoder()],
        [
            'BisonFiPredict',
            getStructEncoder([
                ['side', getBisonFiPredictSideEncoder()],
                ['isBuy', getBooleanEncoder()],
            ]),
        ],
        ['ByrealDynamicV3', getUnitEncoder()],
        [
            'Flux',
            getStructEncoder([
                ['swapId', getU64Encoder()],
                ['baseToQuote', getBooleanEncoder()],
            ]),
        ],
        ['VaultLiquidSellLst', getUnitEncoder()],
        ['VaultLiquidBuyLst', getStructEncoder([['lstAmount', getU64Encoder()]])],
        ['KipseliV2', getStructEncoder([['isBaseToQuote', getBooleanEncoder()]])],
        [
            'Deriverse',
            getStructEncoder([
                ['side', getSideEncoder()],
                ['instrId', getU32Encoder()],
            ]),
        ],
        ['Hadron', getStructEncoder([['isX', getBooleanEncoder()]])],
        ['BinaryFi', getUnitEncoder()],
        ['Metric', getStructEncoder([['zeroForOne', getBooleanEncoder()]])],
        ['JupiterLendDexSwap', getStructEncoder([['swap0to1', getBooleanEncoder()]])],
        ['Gatorswap', getStructEncoder([['baseToQuote', getBooleanEncoder()]])],
        [
            'Flint',
            getStructEncoder([
                ['isGlobal', getBooleanEncoder()],
                ['takerBuy', getBooleanEncoder()],
            ]),
        ],
        ['Denali', getStructEncoder([['baseToQuote', getBooleanEncoder()]])],
        ['PerenaStarV2Deposit', getUnitEncoder()],
        ['PerenaStarV2WithdrawFromExternal', getStructEncoder([['externalLiquiditySource', getU8Encoder()]])],
        ['SanctumSols', getStructEncoder([['swapType', getSanctumSolsSwapTypeEncoder()]])],
    ]);
}

export function getSwapTypeDecoder(): Decoder<SwapType> {
    return getDiscriminatedUnionDecoder([
        ['Saber', getUnitDecoder()],
        ['SaberAddDecimalsDeposit', getUnitDecoder()],
        ['SaberAddDecimalsWithdraw', getUnitDecoder()],
        ['TokenSwap', getUnitDecoder()],
        ['Sencha', getUnitDecoder()],
        ['Step', getUnitDecoder()],
        ['Cropper', getUnitDecoder()],
        ['Raydium', getUnitDecoder()],
        ['Crema', getStructDecoder([['aToB', getBooleanDecoder()]])],
        ['Lifinity', getUnitDecoder()],
        ['Mercurial', getUnitDecoder()],
        ['Cykura', getUnitDecoder()],
        ['Serum', getStructDecoder([['side', getSideDecoder()]])],
        ['MarinadeDeposit', getUnitDecoder()],
        ['MarinadeUnstake', getUnitDecoder()],
        ['Aldrin', getStructDecoder([['side', getSideDecoder()]])],
        ['AldrinV2', getStructDecoder([['side', getSideDecoder()]])],
        ['Whirlpool', getStructDecoder([['aToB', getBooleanDecoder()]])],
        ['Invariant', getStructDecoder([['xToY', getBooleanDecoder()]])],
        ['Meteora', getUnitDecoder()],
        ['GooseFX', getUnitDecoder()],
        ['DeltaFi', getStructDecoder([['stable', getBooleanDecoder()]])],
        ['Balansol', getUnitDecoder()],
        ['MarcoPolo', getStructDecoder([['xToY', getBooleanDecoder()]])],
        ['Dradex', getStructDecoder([['side', getSideDecoder()]])],
        ['LifinityV2', getUnitDecoder()],
        ['RaydiumClmm', getUnitDecoder()],
        ['Openbook', getStructDecoder([['side', getSideDecoder()]])],
        ['Phoenix', getStructDecoder([['side', getSideDecoder()]])],
        [
            'Symmetry',
            getStructDecoder([
                ['fromTokenId', getU64Decoder()],
                ['toTokenId', getU64Decoder()],
            ]),
        ],
        ['TokenSwapV2', getUnitDecoder()],
        ['HeliumTreasuryManagementRedeemV0', getUnitDecoder()],
        ['StakeDexStakeWrappedSol', getUnitDecoder()],
        ['StakeDexSwapViaStake', getStructDecoder([['bridgeStakeSeed', getU32Decoder()]])],
        ['GooseFXV2', getUnitDecoder()],
        ['Perps', getUnitDecoder()],
        ['PerpsAddLiquidity', getUnitDecoder()],
        ['PerpsRemoveLiquidity', getUnitDecoder()],
        ['MeteoraDlmm', getUnitDecoder()],
        ['OpenBookV2', getStructDecoder([['side', getSideDecoder()]])],
        ['RaydiumClmmV2', getUnitDecoder()],
        ['StakeDexPrefundWithdrawStakeAndDepositStake', getStructDecoder([['bridgeStakeSeed', getU32Decoder()]])],
        [
            'Clone',
            getStructDecoder([
                ['poolIndex', getU8Decoder()],
                ['quantityIsInput', getBooleanDecoder()],
                ['quantityIsCollateral', getBooleanDecoder()],
            ]),
        ],
        [
            'SanctumS',
            getStructDecoder([
                ['srcLstValueCalcAccs', getU8Decoder()],
                ['dstLstValueCalcAccs', getU8Decoder()],
                ['srcLstIndex', getU32Decoder()],
                ['dstLstIndex', getU32Decoder()],
            ]),
        ],
        [
            'SanctumSAddLiquidity',
            getStructDecoder([
                ['lstValueCalcAccs', getU8Decoder()],
                ['lstIndex', getU32Decoder()],
            ]),
        ],
        [
            'SanctumSRemoveLiquidity',
            getStructDecoder([
                ['lstValueCalcAccs', getU8Decoder()],
                ['lstIndex', getU32Decoder()],
            ]),
        ],
        ['RaydiumCP', getUnitDecoder()],
        [
            'WhirlpoolSwapV2',
            getStructDecoder([
                ['aToB', getBooleanDecoder()],
                ['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())],
            ]),
        ],
        ['OneIntro', getUnitDecoder()],
        ['PumpWrappedBuy', getUnitDecoder()],
        ['PumpWrappedSell', getUnitDecoder()],
        ['PerpsV2', getUnitDecoder()],
        ['PerpsV2AddLiquidity', getUnitDecoder()],
        ['PerpsV2RemoveLiquidity', getUnitDecoder()],
        ['MoonshotWrappedBuy', getUnitDecoder()],
        ['MoonshotWrappedSell', getUnitDecoder()],
        ['StabbleStableSwap', getUnitDecoder()],
        ['StabbleWeightedSwap', getUnitDecoder()],
        ['Obric', getStructDecoder([['xToY', getBooleanDecoder()]])],
        ['FoxBuyFromEstimatedCost', getUnitDecoder()],
        ['FoxClaimPartial', getStructDecoder([['isY', getBooleanDecoder()]])],
        ['SolFi', getStructDecoder([['isQuoteToBase', getBooleanDecoder()]])],
        ['SolayerDelegateNoInit', getUnitDecoder()],
        ['SolayerUndelegateNoInit', getUnitDecoder()],
        ['TokenMill', getStructDecoder([['side', getSideDecoder()]])],
        ['DaosFunBuy', getUnitDecoder()],
        ['DaosFunSell', getUnitDecoder()],
        ['ZeroFi', getUnitDecoder()],
        ['StakeDexWithdrawWrappedSol', getUnitDecoder()],
        ['VirtualsBuy', getUnitDecoder()],
        ['VirtualsSell', getUnitDecoder()],
        [
            'Perena',
            getStructDecoder([
                ['inIndex', getU8Decoder()],
                ['outIndex', getU8Decoder()],
            ]),
        ],
        ['PumpSwapBuy', getUnitDecoder()],
        ['PumpSwapSell', getUnitDecoder()],
        ['Gamma', getUnitDecoder()],
        ['MeteoraDlmmSwapV2', getStructDecoder([['remainingAccountsInfo', getRemainingAccountsInfoDecoder()]])],
        ['Woofi', getUnitDecoder()],
        ['MeteoraDammV2', getUnitDecoder()],
        ['MeteoraDynamicBondingCurveSwap', getUnitDecoder()],
        ['StabbleStableSwapV2', getUnitDecoder()],
        ['StabbleWeightedSwapV2', getUnitDecoder()],
        ['RaydiumLaunchlabBuy', getStructDecoder([['shareFeeRate', getU64Decoder()]])],
        ['RaydiumLaunchlabSell', getStructDecoder([['shareFeeRate', getU64Decoder()]])],
        ['BoopdotfunWrappedBuy', getUnitDecoder()],
        ['BoopdotfunWrappedSell', getUnitDecoder()],
        ['Plasma', getStructDecoder([['side', getSideDecoder()]])],
        [
            'GoonFi',
            getStructDecoder([
                ['isBid', getBooleanDecoder()],
                ['blacklistBump', getU8Decoder()],
            ]),
        ],
        [
            'HumidiFi',
            getStructDecoder([
                ['swapId', getU64Decoder()],
                ['isBaseToQuote', getBooleanDecoder()],
            ]),
        ],
        ['MeteoraDynamicBondingCurveSwapWithRemainingAccounts', getUnitDecoder()],
        ['TesseraV', getStructDecoder([['side', getSideDecoder()]])],
        ['PumpWrappedBuyV2', getUnitDecoder()],
        ['PumpWrappedSellV2', getUnitDecoder()],
        ['PumpSwapBuyV2', getUnitDecoder()],
        ['PumpSwapSellV2', getUnitDecoder()],
        ['Heaven', getStructDecoder([['aToB', getBooleanDecoder()]])],
        ['SolFiV2', getStructDecoder([['isQuoteToBase', getBooleanDecoder()]])],
        ['Aquifer', getUnitDecoder()],
        ['PumpWrappedBuyV3', getUnitDecoder()],
        ['PumpWrappedSellV3', getUnitDecoder()],
        ['PumpSwapBuyV3', getUnitDecoder()],
        ['PumpSwapSellV3', getUnitDecoder()],
        ['JupiterLendDeposit', getUnitDecoder()],
        ['JupiterLendRedeem', getUnitDecoder()],
        [
            'DefiTuna',
            getStructDecoder([
                ['aToB', getBooleanDecoder()],
                ['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())],
            ]),
        ],
        ['AlphaQ', getStructDecoder([['aToB', getBooleanDecoder()]])],
        ['RaydiumV2', getUnitDecoder()],
        ['SarosDlmm', getStructDecoder([['swapForY', getBooleanDecoder()]])],
        ['Futarchy', getStructDecoder([['side', getSideDecoder()]])],
        ['MeteoraDammV2WithRemainingAccounts', getUnitDecoder()],
        ['Obsidian', getUnitDecoder()],
        ['WhaleStreet', getStructDecoder([['side', getSideDecoder()]])],
        [
            'DynamicV1',
            getStructDecoder([
                ['candidateSwaps', getArrayDecoder(getCandidateSwapDecoder())],
                ['bestPosition', getOptionDecoder(getU8Decoder())],
            ]),
        ],
        ['PumpWrappedBuyV4', getUnitDecoder()],
        ['PumpWrappedSellV4', getUnitDecoder()],
        ['CarrotIssue', getUnitDecoder()],
        ['CarrotRedeem', getUnitDecoder()],
        ['Manifest', getStructDecoder([['side', getSideDecoder()]])],
        ['BisonFi', getStructDecoder([['aToB', getBooleanDecoder()]])],
        [
            'HumidiFiV2',
            getStructDecoder([
                ['swapId', getU64Decoder()],
                ['isBaseToQuote', getBooleanDecoder()],
            ]),
        ],
        ['PerenaStar', getStructDecoder([['isMint', getBooleanDecoder()]])],
        [
            'JupiterRfqV2',
            getStructDecoder([
                ['side', getSideDecoder()],
                ['fillData', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
            ]),
        ],
        ['GoonFiV2', getStructDecoder([['isBid', getBooleanDecoder()]])],
        ['Scorch', getStructDecoder([['swapId', getU128Decoder()]])],
        [
            'VaultLiquidUnstake',
            getStructDecoder([
                ['lstAmounts', getArrayDecoder(getU64Decoder(), { size: 5 })],
                ['seed', getU64Decoder()],
            ]),
        ],
        ['XOrca', getUnitDecoder()],
        ['Quantum', getStructDecoder([['side', getSideDecoder()]])],
        [
            'WhaleStreetV2',
            getStructDecoder([
                ['side', getSideDecoder()],
                ['authAmountIn', getU64Decoder()],
                ['auth', getU64Decoder()],
            ]),
        ],
        ['Riptide', getStructDecoder([['amountIsTokenA', getBooleanDecoder()]])],
        ['RunnerRodeo', getUnitDecoder()],
        ['TaurusFi', getStructDecoder([['isBaseIn', getBooleanDecoder()]])],
        ['Omnipair', getUnitDecoder()],
        ['MSwap', getUnitDecoder()],
        ['Hylo', getStructDecoder([['swapType', getHyloSwapTypeDecoder()]])],
        ['VoltrDeposit', getUnitDecoder()],
        ['VoltrWithdraw', getUnitDecoder()],
        [
            'SanctumSV2',
            getStructDecoder([
                ['srcLstValueCalcAccs', getU8Decoder()],
                ['dstLstValueCalcAccs', getU8Decoder()],
                ['srcLstIndex', getU32Decoder()],
                ['dstLstIndex', getU32Decoder()],
            ]),
        ],
        ['LemmingsFi', getStructDecoder([['isBaseIn', getBooleanDecoder()]])],
        ['ScaleVmmBuy', getUnitDecoder()],
        ['ScaleVmmSell', getUnitDecoder()],
        ['ScaleAmmBuy', getUnitDecoder()],
        ['ScaleAmmSell', getUnitDecoder()],
        ['BisonFiV2', getStructDecoder([['aToB', getBooleanDecoder()]])],
        ['Trends', getUnitDecoder()],
        ['HumaDeposit', getUnitDecoder()],
        ['HumaInstantWithdraw', getUnitDecoder()],
        ['Kipseli', getStructDecoder([['isBaseToQuote', getBooleanDecoder()]])],
        [
            'DynamicV2',
            getStructDecoder([
                ['candidateSwaps', getArrayDecoder(getCandidateSwapWithBpsDecoder())],
                ['maxSplitQuoteCalls', getU8Decoder()],
                ['maxSplitCandidates', getU8Decoder()],
            ]),
        ],
        ['PumpSwapBuyV3WithCashbackClaim', getUnitDecoder()],
        ['PumpSwapSellV3WithCashbackClaim', getUnitDecoder()],
        ['PumpWrappedBuyV4WithCashbackClaim', getUnitDecoder()],
        ['PumpWrappedSellV4WithCashbackClaim', getUnitDecoder()],
        ['GoonFiV3', getStructDecoder([['isBid', getBooleanDecoder()]])],
        ['PumpWrappedBuyV5', getStructDecoder([['claimCashback', getBooleanDecoder()]])],
        ['PumpWrappedSellV5', getStructDecoder([['claimCashback', getBooleanDecoder()]])],
        ['ZeroFiSwapV2', getUnitDecoder()],
        [
            'BisonFiPredict',
            getStructDecoder([
                ['side', getBisonFiPredictSideDecoder()],
                ['isBuy', getBooleanDecoder()],
            ]),
        ],
        ['ByrealDynamicV3', getUnitDecoder()],
        [
            'Flux',
            getStructDecoder([
                ['swapId', getU64Decoder()],
                ['baseToQuote', getBooleanDecoder()],
            ]),
        ],
        ['VaultLiquidSellLst', getUnitDecoder()],
        ['VaultLiquidBuyLst', getStructDecoder([['lstAmount', getU64Decoder()]])],
        ['KipseliV2', getStructDecoder([['isBaseToQuote', getBooleanDecoder()]])],
        [
            'Deriverse',
            getStructDecoder([
                ['side', getSideDecoder()],
                ['instrId', getU32Decoder()],
            ]),
        ],
        ['Hadron', getStructDecoder([['isX', getBooleanDecoder()]])],
        ['BinaryFi', getUnitDecoder()],
        ['Metric', getStructDecoder([['zeroForOne', getBooleanDecoder()]])],
        ['JupiterLendDexSwap', getStructDecoder([['swap0to1', getBooleanDecoder()]])],
        ['Gatorswap', getStructDecoder([['baseToQuote', getBooleanDecoder()]])],
        [
            'Flint',
            getStructDecoder([
                ['isGlobal', getBooleanDecoder()],
                ['takerBuy', getBooleanDecoder()],
            ]),
        ],
        ['Denali', getStructDecoder([['baseToQuote', getBooleanDecoder()]])],
        ['PerenaStarV2Deposit', getUnitDecoder()],
        ['PerenaStarV2WithdrawFromExternal', getStructDecoder([['externalLiquiditySource', getU8Decoder()]])],
        ['SanctumSols', getStructDecoder([['swapType', getSanctumSolsSwapTypeDecoder()]])],
    ]);
}

export function getSwapTypeCodec(): Codec<SwapTypeArgs, SwapType> {
    return combineCodec(getSwapTypeEncoder(), getSwapTypeDecoder());
}

// Data Enum Helpers.
export function swapType(kind: 'Saber'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Saber'>;
export function swapType(
    kind: 'SaberAddDecimalsDeposit',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SaberAddDecimalsDeposit'>;
export function swapType(
    kind: 'SaberAddDecimalsWithdraw',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SaberAddDecimalsWithdraw'>;
export function swapType(kind: 'TokenSwap'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'TokenSwap'>;
export function swapType(kind: 'Sencha'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Sencha'>;
export function swapType(kind: 'Step'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Step'>;
export function swapType(kind: 'Cropper'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Cropper'>;
export function swapType(kind: 'Raydium'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Raydium'>;
export function swapType(
    kind: 'Crema',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Crema'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Crema'>;
export function swapType(kind: 'Lifinity'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Lifinity'>;
export function swapType(kind: 'Mercurial'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Mercurial'>;
export function swapType(kind: 'Cykura'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Cykura'>;
export function swapType(
    kind: 'Serum',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Serum'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Serum'>;
export function swapType(
    kind: 'MarinadeDeposit',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MarinadeDeposit'>;
export function swapType(
    kind: 'MarinadeUnstake',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MarinadeUnstake'>;
export function swapType(
    kind: 'Aldrin',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Aldrin'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Aldrin'>;
export function swapType(
    kind: 'AldrinV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'AldrinV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'AldrinV2'>;
export function swapType(
    kind: 'Whirlpool',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Whirlpool'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Whirlpool'>;
export function swapType(
    kind: 'Invariant',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Invariant'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Invariant'>;
export function swapType(kind: 'Meteora'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Meteora'>;
export function swapType(kind: 'GooseFX'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'GooseFX'>;
export function swapType(
    kind: 'DeltaFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'DeltaFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'DeltaFi'>;
export function swapType(kind: 'Balansol'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Balansol'>;
export function swapType(
    kind: 'MarcoPolo',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'MarcoPolo'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MarcoPolo'>;
export function swapType(
    kind: 'Dradex',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Dradex'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Dradex'>;
export function swapType(kind: 'LifinityV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'LifinityV2'>;
export function swapType(kind: 'RaydiumClmm'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RaydiumClmm'>;
export function swapType(
    kind: 'Openbook',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Openbook'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Openbook'>;
export function swapType(
    kind: 'Phoenix',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Phoenix'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Phoenix'>;
export function swapType(
    kind: 'Symmetry',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Symmetry'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Symmetry'>;
export function swapType(kind: 'TokenSwapV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'TokenSwapV2'>;
export function swapType(
    kind: 'HeliumTreasuryManagementRedeemV0',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'HeliumTreasuryManagementRedeemV0'>;
export function swapType(
    kind: 'StakeDexStakeWrappedSol',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StakeDexStakeWrappedSol'>;
export function swapType(
    kind: 'StakeDexSwapViaStake',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'StakeDexSwapViaStake'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StakeDexSwapViaStake'>;
export function swapType(kind: 'GooseFXV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'GooseFXV2'>;
export function swapType(kind: 'Perps'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Perps'>;
export function swapType(
    kind: 'PerpsAddLiquidity',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerpsAddLiquidity'>;
export function swapType(
    kind: 'PerpsRemoveLiquidity',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerpsRemoveLiquidity'>;
export function swapType(kind: 'MeteoraDlmm'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MeteoraDlmm'>;
export function swapType(
    kind: 'OpenBookV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'OpenBookV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'OpenBookV2'>;
export function swapType(kind: 'RaydiumClmmV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RaydiumClmmV2'>;
export function swapType(
    kind: 'StakeDexPrefundWithdrawStakeAndDepositStake',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'StakeDexPrefundWithdrawStakeAndDepositStake'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StakeDexPrefundWithdrawStakeAndDepositStake'>;
export function swapType(
    kind: 'Clone',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Clone'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Clone'>;
export function swapType(
    kind: 'SanctumS',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SanctumS'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SanctumS'>;
export function swapType(
    kind: 'SanctumSAddLiquidity',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SanctumSAddLiquidity'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SanctumSAddLiquidity'>;
export function swapType(
    kind: 'SanctumSRemoveLiquidity',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SanctumSRemoveLiquidity'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SanctumSRemoveLiquidity'>;
export function swapType(kind: 'RaydiumCP'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RaydiumCP'>;
export function swapType(
    kind: 'WhirlpoolSwapV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'WhirlpoolSwapV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'WhirlpoolSwapV2'>;
export function swapType(kind: 'OneIntro'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'OneIntro'>;
export function swapType(
    kind: 'PumpWrappedBuy',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedBuy'>;
export function swapType(
    kind: 'PumpWrappedSell',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedSell'>;
export function swapType(kind: 'PerpsV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerpsV2'>;
export function swapType(
    kind: 'PerpsV2AddLiquidity',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerpsV2AddLiquidity'>;
export function swapType(
    kind: 'PerpsV2RemoveLiquidity',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerpsV2RemoveLiquidity'>;
export function swapType(
    kind: 'MoonshotWrappedBuy',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MoonshotWrappedBuy'>;
export function swapType(
    kind: 'MoonshotWrappedSell',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MoonshotWrappedSell'>;
export function swapType(
    kind: 'StabbleStableSwap',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StabbleStableSwap'>;
export function swapType(
    kind: 'StabbleWeightedSwap',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StabbleWeightedSwap'>;
export function swapType(
    kind: 'Obric',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Obric'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Obric'>;
export function swapType(
    kind: 'FoxBuyFromEstimatedCost',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'FoxBuyFromEstimatedCost'>;
export function swapType(
    kind: 'FoxClaimPartial',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'FoxClaimPartial'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'FoxClaimPartial'>;
export function swapType(
    kind: 'SolFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SolFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SolFi'>;
export function swapType(
    kind: 'SolayerDelegateNoInit',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SolayerDelegateNoInit'>;
export function swapType(
    kind: 'SolayerUndelegateNoInit',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SolayerUndelegateNoInit'>;
export function swapType(
    kind: 'TokenMill',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'TokenMill'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'TokenMill'>;
export function swapType(kind: 'DaosFunBuy'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'DaosFunBuy'>;
export function swapType(kind: 'DaosFunSell'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'DaosFunSell'>;
export function swapType(kind: 'ZeroFi'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ZeroFi'>;
export function swapType(
    kind: 'StakeDexWithdrawWrappedSol',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StakeDexWithdrawWrappedSol'>;
export function swapType(kind: 'VirtualsBuy'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VirtualsBuy'>;
export function swapType(kind: 'VirtualsSell'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VirtualsSell'>;
export function swapType(
    kind: 'Perena',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Perena'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Perena'>;
export function swapType(kind: 'PumpSwapBuy'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapBuy'>;
export function swapType(kind: 'PumpSwapSell'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapSell'>;
export function swapType(kind: 'Gamma'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Gamma'>;
export function swapType(
    kind: 'MeteoraDlmmSwapV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'MeteoraDlmmSwapV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MeteoraDlmmSwapV2'>;
export function swapType(kind: 'Woofi'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Woofi'>;
export function swapType(kind: 'MeteoraDammV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MeteoraDammV2'>;
export function swapType(
    kind: 'MeteoraDynamicBondingCurveSwap',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MeteoraDynamicBondingCurveSwap'>;
export function swapType(
    kind: 'StabbleStableSwapV2',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StabbleStableSwapV2'>;
export function swapType(
    kind: 'StabbleWeightedSwapV2',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'StabbleWeightedSwapV2'>;
export function swapType(
    kind: 'RaydiumLaunchlabBuy',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'RaydiumLaunchlabBuy'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RaydiumLaunchlabBuy'>;
export function swapType(
    kind: 'RaydiumLaunchlabSell',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'RaydiumLaunchlabSell'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RaydiumLaunchlabSell'>;
export function swapType(
    kind: 'BoopdotfunWrappedBuy',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'BoopdotfunWrappedBuy'>;
export function swapType(
    kind: 'BoopdotfunWrappedSell',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'BoopdotfunWrappedSell'>;
export function swapType(
    kind: 'Plasma',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Plasma'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Plasma'>;
export function swapType(
    kind: 'GoonFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'GoonFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'GoonFi'>;
export function swapType(
    kind: 'HumidiFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'HumidiFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'HumidiFi'>;
export function swapType(
    kind: 'MeteoraDynamicBondingCurveSwapWithRemainingAccounts',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MeteoraDynamicBondingCurveSwapWithRemainingAccounts'>;
export function swapType(
    kind: 'TesseraV',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'TesseraV'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'TesseraV'>;
export function swapType(
    kind: 'PumpWrappedBuyV2',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedBuyV2'>;
export function swapType(
    kind: 'PumpWrappedSellV2',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedSellV2'>;
export function swapType(kind: 'PumpSwapBuyV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapBuyV2'>;
export function swapType(
    kind: 'PumpSwapSellV2',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapSellV2'>;
export function swapType(
    kind: 'Heaven',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Heaven'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Heaven'>;
export function swapType(
    kind: 'SolFiV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SolFiV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SolFiV2'>;
export function swapType(kind: 'Aquifer'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Aquifer'>;
export function swapType(
    kind: 'PumpWrappedBuyV3',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedBuyV3'>;
export function swapType(
    kind: 'PumpWrappedSellV3',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedSellV3'>;
export function swapType(kind: 'PumpSwapBuyV3'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapBuyV3'>;
export function swapType(
    kind: 'PumpSwapSellV3',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapSellV3'>;
export function swapType(
    kind: 'JupiterLendDeposit',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'JupiterLendDeposit'>;
export function swapType(
    kind: 'JupiterLendRedeem',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'JupiterLendRedeem'>;
export function swapType(
    kind: 'DefiTuna',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'DefiTuna'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'DefiTuna'>;
export function swapType(
    kind: 'AlphaQ',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'AlphaQ'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'AlphaQ'>;
export function swapType(kind: 'RaydiumV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RaydiumV2'>;
export function swapType(
    kind: 'SarosDlmm',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SarosDlmm'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SarosDlmm'>;
export function swapType(
    kind: 'Futarchy',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Futarchy'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Futarchy'>;
export function swapType(
    kind: 'MeteoraDammV2WithRemainingAccounts',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MeteoraDammV2WithRemainingAccounts'>;
export function swapType(kind: 'Obsidian'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Obsidian'>;
export function swapType(
    kind: 'WhaleStreet',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'WhaleStreet'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'WhaleStreet'>;
export function swapType(
    kind: 'DynamicV1',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'DynamicV1'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'DynamicV1'>;
export function swapType(
    kind: 'PumpWrappedBuyV4',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedBuyV4'>;
export function swapType(
    kind: 'PumpWrappedSellV4',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedSellV4'>;
export function swapType(kind: 'CarrotIssue'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'CarrotIssue'>;
export function swapType(kind: 'CarrotRedeem'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'CarrotRedeem'>;
export function swapType(
    kind: 'Manifest',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Manifest'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Manifest'>;
export function swapType(
    kind: 'BisonFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'BisonFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'BisonFi'>;
export function swapType(
    kind: 'HumidiFiV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'HumidiFiV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'HumidiFiV2'>;
export function swapType(
    kind: 'PerenaStar',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'PerenaStar'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerenaStar'>;
export function swapType(
    kind: 'JupiterRfqV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'JupiterRfqV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'JupiterRfqV2'>;
export function swapType(
    kind: 'GoonFiV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'GoonFiV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'GoonFiV2'>;
export function swapType(
    kind: 'Scorch',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Scorch'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Scorch'>;
export function swapType(
    kind: 'VaultLiquidUnstake',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'VaultLiquidUnstake'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VaultLiquidUnstake'>;
export function swapType(kind: 'XOrca'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'XOrca'>;
export function swapType(
    kind: 'Quantum',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Quantum'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Quantum'>;
export function swapType(
    kind: 'WhaleStreetV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'WhaleStreetV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'WhaleStreetV2'>;
export function swapType(
    kind: 'Riptide',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Riptide'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Riptide'>;
export function swapType(kind: 'RunnerRodeo'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'RunnerRodeo'>;
export function swapType(
    kind: 'TaurusFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'TaurusFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'TaurusFi'>;
export function swapType(kind: 'Omnipair'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Omnipair'>;
export function swapType(kind: 'MSwap'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'MSwap'>;
export function swapType(
    kind: 'Hylo',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Hylo'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Hylo'>;
export function swapType(kind: 'VoltrDeposit'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VoltrDeposit'>;
export function swapType(kind: 'VoltrWithdraw'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VoltrWithdraw'>;
export function swapType(
    kind: 'SanctumSV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SanctumSV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SanctumSV2'>;
export function swapType(
    kind: 'LemmingsFi',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'LemmingsFi'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'LemmingsFi'>;
export function swapType(kind: 'ScaleVmmBuy'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ScaleVmmBuy'>;
export function swapType(kind: 'ScaleVmmSell'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ScaleVmmSell'>;
export function swapType(kind: 'ScaleAmmBuy'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ScaleAmmBuy'>;
export function swapType(kind: 'ScaleAmmSell'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ScaleAmmSell'>;
export function swapType(
    kind: 'BisonFiV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'BisonFiV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'BisonFiV2'>;
export function swapType(kind: 'Trends'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Trends'>;
export function swapType(kind: 'HumaDeposit'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'HumaDeposit'>;
export function swapType(
    kind: 'HumaInstantWithdraw',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'HumaInstantWithdraw'>;
export function swapType(
    kind: 'Kipseli',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Kipseli'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Kipseli'>;
export function swapType(
    kind: 'DynamicV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'DynamicV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'DynamicV2'>;
export function swapType(
    kind: 'PumpSwapBuyV3WithCashbackClaim',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapBuyV3WithCashbackClaim'>;
export function swapType(
    kind: 'PumpSwapSellV3WithCashbackClaim',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpSwapSellV3WithCashbackClaim'>;
export function swapType(
    kind: 'PumpWrappedBuyV4WithCashbackClaim',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedBuyV4WithCashbackClaim'>;
export function swapType(
    kind: 'PumpWrappedSellV4WithCashbackClaim',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedSellV4WithCashbackClaim'>;
export function swapType(
    kind: 'GoonFiV3',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'GoonFiV3'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'GoonFiV3'>;
export function swapType(
    kind: 'PumpWrappedBuyV5',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'PumpWrappedBuyV5'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedBuyV5'>;
export function swapType(
    kind: 'PumpWrappedSellV5',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'PumpWrappedSellV5'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PumpWrappedSellV5'>;
export function swapType(kind: 'ZeroFiSwapV2'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ZeroFiSwapV2'>;
export function swapType(
    kind: 'BisonFiPredict',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'BisonFiPredict'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'BisonFiPredict'>;
export function swapType(
    kind: 'ByrealDynamicV3',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'ByrealDynamicV3'>;
export function swapType(
    kind: 'Flux',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Flux'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Flux'>;
export function swapType(
    kind: 'VaultLiquidSellLst',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VaultLiquidSellLst'>;
export function swapType(
    kind: 'VaultLiquidBuyLst',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'VaultLiquidBuyLst'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'VaultLiquidBuyLst'>;
export function swapType(
    kind: 'KipseliV2',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'KipseliV2'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'KipseliV2'>;
export function swapType(
    kind: 'Deriverse',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Deriverse'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Deriverse'>;
export function swapType(
    kind: 'Hadron',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Hadron'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Hadron'>;
export function swapType(kind: 'BinaryFi'): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'BinaryFi'>;
export function swapType(
    kind: 'Metric',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Metric'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Metric'>;
export function swapType(
    kind: 'JupiterLendDexSwap',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'JupiterLendDexSwap'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'JupiterLendDexSwap'>;
export function swapType(
    kind: 'Gatorswap',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Gatorswap'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Gatorswap'>;
export function swapType(
    kind: 'Flint',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Flint'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Flint'>;
export function swapType(
    kind: 'Denali',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'Denali'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'Denali'>;
export function swapType(
    kind: 'PerenaStarV2Deposit',
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerenaStarV2Deposit'>;
export function swapType(
    kind: 'PerenaStarV2WithdrawFromExternal',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'PerenaStarV2WithdrawFromExternal'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'PerenaStarV2WithdrawFromExternal'>;
export function swapType(
    kind: 'SanctumSols',
    data: GetDiscriminatedUnionVariantContent<SwapTypeArgs, '__kind', 'SanctumSols'>,
): GetDiscriminatedUnionVariant<SwapTypeArgs, '__kind', 'SanctumSols'>;
export function swapType<K extends SwapTypeArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isSwapType<K extends SwapType['__kind']>(kind: K, value: SwapType): value is SwapType & { __kind: K } {
    return value.__kind === kind;
}
