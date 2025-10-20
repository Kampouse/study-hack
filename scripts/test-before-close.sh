#!/bin/bash
# Comprehensive test script before closing issues

echo "🚀 Running comprehensive tests before closing issue..."

echo "📝 1. Running TypeScript type checking..."
npm run build.types || {
    echo "❌ TypeScript errors found!"
    exit 1
}

echo "🔍 2. Running Biome checks..."
biome check . || {
    echo "❌ Biome linting/formatting issues found!"
    echo "💡 Run 'biome check --write .' to fix auto-fixable issues"
    exit 1
}

echo "🧪 3. Running tests..."
npm run test || {
    echo "❌ Tests failed!"
    exit 1
}

echo "🏗️ 4. Building the project..."
npm run build || {
    echo "❌ Build failed!"
    exit 1
}

echo "✅ All checks passed! Ready to close the issue."
exit 0