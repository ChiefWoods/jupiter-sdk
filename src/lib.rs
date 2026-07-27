//! Jupiter on-chain product SDKs.

#[cfg(feature = "aggregator-v6")]
pub use jupiter_aggregator_v6_sdk as aggregator_v6;

#[cfg(feature = "governance")]
pub use jupiter_governance_sdk as governance;

#[cfg(feature = "lend-borrow")]
pub use jupiter_lend_borrow_sdk as lend_borrow;

#[cfg(feature = "lend-dex")]
pub use jupiter_lend_dex_sdk as lend_dex;

#[cfg(feature = "lend-earn")]
pub use jupiter_lend_earn_sdk as lend_earn;

#[cfg(feature = "lend-flash-loan")]
pub use jupiter_lend_flash_loan_sdk as lend_flash_loan;

#[cfg(feature = "lend-lending-reward-rate-model")]
pub use jupiter_lend_lending_reward_rate_model_sdk as lend_lending_reward_rate_model;

#[cfg(feature = "lend-liquidity")]
pub use jupiter_lend_liquidity_sdk as lend_liquidity;

#[cfg(feature = "lend-oracle")]
pub use jupiter_lend_oracle_sdk as lend_oracle;

#[cfg(feature = "lock")]
pub use jupiter_lock_sdk as lock;

#[cfg(feature = "offerbook")]
pub use jupiter_offerbook_sdk as offerbook;

#[cfg(feature = "perps")]
pub use jupiter_perps_sdk as perps;

#[cfg(feature = "prediction")]
pub use jupiter_prediction_sdk as prediction;

#[cfg(feature = "rewards-hub")]
pub use jupiter_rewards_hub_sdk as rewards_hub;

#[cfg(feature = "stablecoin")]
pub use jupiter_stablecoin_sdk as stablecoin;
