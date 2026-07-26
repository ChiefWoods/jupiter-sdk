//! Jupiter on-chain product SDKs.

#[cfg(feature = "lend-earn")]
pub use jupiter_lend_earn_sdk as lend_earn;

#[cfg(feature = "lock")]
pub use jupiter_lock_sdk as lock;

#[cfg(feature = "offerbook")]
pub use jupiter_offerbook_sdk as offerbook;

#[cfg(feature = "prediction")]
pub use jupiter_prediction_sdk as prediction;

#[cfg(feature = "stablecoin")]
pub use jupiter_stablecoin_sdk as stablecoin;
