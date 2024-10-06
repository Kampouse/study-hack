use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };

    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["bun", "npm", "pnpm", "classic.yarnpkg.com", "mise"])?
        .with_exec(vec!["pkgx", "install", &format!("node@{}", version)])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let package_manager = dag().get_env("PACKAGE_MANAGER").unwrap_or_default();
    let mut package_manager = package_manager.as_str();

    if package_manager.is_empty() {
        package_manager = "pnpm";
    }

    let version = dag().get_env("NODE_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "-yarnpkg.com",
            &format!("+nodejs.org@{}", version),
            "+bun",
            "+npm",
            "+pnpm",
            "+classic.yarnpkg.com",
            "+mise",
            package_manager,
            "run",
            "test",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    let package_manager = dag().get_env("PACKAGE_MANAGER").unwrap_or_default();
    let mut package_manager = package_manager.as_str();

    if package_manager.is_empty() {
        package_manager = "npm";
    }

    let version = dag().get_env("NODE_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "-yarnpkg.com",
            &format!("+nodejs.org@{}", version),
            "+bun",
            "+npm",
            "+pnpm",
            "+classic.yarnpkg.com",
            "+mise",
            package_manager,
            "run",
            "build",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn run(args: String) -> FnResult<String> {
    let package_manager = dag().get_env("PACKAGE_MANAGER").unwrap_or_default();
    let mut package_manager = package_manager.as_str();

    if package_manager.is_empty() {
        package_manager = "npm";
    }

    let version = dag().get_env("NODE_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "-yarnpkg.com",
            &format!("+nodejs.org@{}", version),
            "+bun",
            "+npm",
            "+pnpm",
            "+classic.yarnpkg.com",
            "+mise",
            package_manager,
            "run",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn npx(args: String) -> FnResult<String> {
    let version = dag().get_env("NODE_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            &format!("+nodejs.org@{}", version),
            "+npm",
            "npx",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn install(args: String) -> FnResult<String> {
    let package_manager = dag().get_env("PACKAGE_MANAGER").unwrap_or_default();
    let mut package_manager = package_manager.as_str();

    if package_manager.is_empty() {
        package_manager = "pnpm";
    }

    let version = dag().get_env("NODE_VERSION").unwrap_or_default();
    let mut version = version.as_str();

    if version.is_empty() {
        version = "latest";
    }

    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            &format!("+nodejs.org@{}", version),
            "+bun",
            "+npm",
            "+pnpm",
            "+classic.yarnpkg.com",
            "+mise",
            package_manager,
            "install",
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}
