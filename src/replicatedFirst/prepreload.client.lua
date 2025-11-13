local screen = Instance.new("ScreenGui")
screen.IgnoreGuiInset = true
screen.Name = "PREPRELOAD"
screen.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")
screen.ZIndexBehavior = Enum.ZIndexBehavior.Global

local frame = Instance.new("Frame")
frame.Size = UDim2.new(5, 0, 5, 0)
frame.AnchorPoint = Vector2.new(0.5, 0.5)
frame.Position = UDim2.new(0.5, 0, 0.5, 0)
frame.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
frame.ZIndex = -100
frame.Parent = screen