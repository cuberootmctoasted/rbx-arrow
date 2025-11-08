local controls = require(game:GetService("Players").LocalPlayer:WaitForChild("PlayerScripts"):WaitForChild("PlayerModule")):GetControls()
controls:Disable()
game:GetService("ReplicatedFirst"):RemoveDefaultLoadingScreen()
game:GetService("TeleportService"):SetTeleportGui(Instance.new("ScreenGui"))