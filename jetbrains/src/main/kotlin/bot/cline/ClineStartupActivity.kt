package bot.cline

import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.ProjectActivity

/**
 * Startup activity that initializes the Cline plugin when a project is opened.
 */
class ClineStartupActivity : ProjectActivity {
    override suspend fun execute(project: Project) {
        // Cline plugin initialization
    }
}
