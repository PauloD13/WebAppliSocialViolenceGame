# ==============================================================================
# SCRIPT DE CONFIGURAÇÃO DE ARQUITETURA
# ==============================================================================

$basePath = "src"

# 1. Definição de Diretórios Globais e Shared
$directories = @(
    "$basePath/app/providers",
    "$basePath/app/routes",
    "$basePath/app/styles",
    "$basePath/shared/components",
    "$basePath/shared/hooks",
    "$basePath/shared/api",
    "$basePath/shared/types",
    "$basePath/shared/stores",
    "$basePath/assets/images",
    "$basePath/assets/icons"
)

# 2. Definição das Features Obrigatórias
$features = @(
    "auth", "nickname", "trails", "lessons", 
    "quiz", "results", "ranking", "about", 
    "content", "realtime"
)
$subFeatures = @("pages", "components", "hooks", "api", "services", "types")

foreach ($feature in $features) {
    foreach ($sub in $subFeatures) {
        $directories += "$basePath/features/$feature/$sub"
    }
}

Write-Host "Criando estrutura de diretorios..." -ForegroundColor Cyan
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 3. Definição de Arquivos Base usando Here-Strings (Mais seguro)
$filesWithContent = @{}

$filesWithContent["$basePath/main.tsx"] = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@

$filesWithContent["$basePath/App.tsx"] = @"
import React from 'react';

export default function App() {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <h1>Awareness Trail Base Platform</h1>
    </div>
  );
}
"@

$filesWithContent["$basePath/app/styles/index.css"] = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@

$filesWithContent["$basePath/app/routes/AppRoutes.tsx"] = @"
export const AppRoutes = () => { return null; };
"@

$filesWithContent["$basePath/shared/api/axiosClient.ts"] = @"
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});
"@

# 4. Componentes do Design System (Uso do PS-Variable Escapado)
$sharedComponents = @(
    "Button", "Card", "Badge", "QuizCard", "TrailNode", 
    "ProgressIndicator", "RankingCard", "StatisticCard", 
    "BottomNavigation", "Modal", "Alert", "EmptyState", "LoadingState"
)

foreach ($comp in $sharedComponents) {
    $filesWithContent["$basePath/shared/components/$comp.tsx"] = @"
import React from 'react';

export interface ${comp}Props {}

export const ${comp}: React.FC<${comp}Props> = () => {
  return <div>$comp Component</div>;
};
"@
}

# 5. Arquivos de Índice por Feature
foreach ($feature in $features) {
    $filesWithContent["$basePath/features/$feature/pages/index.ts"] = "// Exportacao de paginas da feature $feature"
    $filesWithContent["$basePath/features/$feature/components/index.ts"] = "// Exportacao de componentes locais da feature $feature"
    $filesWithContent["$basePath/features/$feature/hooks/index.ts"] = "// Exportacao de custom hooks da feature $feature"
    $filesWithContent["$basePath/features/$feature/api/index.ts"] = "// Exportacao de endpoints e queries (React Query) da feature $feature"
    $filesWithContent["$basePath/features/$feature/services/index.ts"] = "// Exportacao de servicos/parsers de dados da feature $feature"
    $filesWithContent["$feature/types/index.ts"] = "// Interfaces e Types TypeScript exclusivos da feature $feature"
}

# 6. Escrita dos Arquivos no Disco
Write-Host "Gerando arquivos e boilerplate basico..." -ForegroundColor Cyan
foreach ($item in $filesWithContent.GetEnumerator()) {
    $filePath = $item.Key
    $content = $item.Value
    
    if (!(Test-Path $filePath)) {
        New-Item -ItemType File -Path $filePath -Force | Out-Null
        Set-Content -Path $filePath -Value $content -Encoding UTF8
    }
}

Write-Host "Arquitetura Feature-Based montada com sucesso!" -ForegroundColor Green
Write-Host "Proximo passo: Começar o mapeamento dos models/types globais." -ForegroundColor Yellow