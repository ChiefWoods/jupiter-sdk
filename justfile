default:
	@just --list

# Product crates must be on crates.io before the umbrella (path deps become version deps on publish).
publish:
	cargo publish -p jupiter-offerbook-sdk --allow-dirty
	cargo publish -p jupiter-prediction-sdk --allow-dirty
	cargo publish -p jupiter-stablecoin-sdk --allow-dirty
	cargo publish -p jupiter-program-sdk --allow-dirty
