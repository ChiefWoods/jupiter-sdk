default:
	@just --list

publish:
	cargo publish --workspace --allow-dirty
